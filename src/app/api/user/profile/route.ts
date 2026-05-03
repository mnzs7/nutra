import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, 'Nova palavra-passe deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número')
    .optional(),
})

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { name, currentPassword, newPassword } = validation.data

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Palavra-passe atual é obrigatória para alterar a palavra-passe' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      })

      if (!user?.password) {
        return NextResponse.json(
          { error: 'Não é possível alterar a palavra-passe de contas OAuth' },
          { status: 400 }
        )
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Palavra-passe atual incorreta' },
          { status: 400 }
        )
      }
    }

    const updateData: { name: string; password?: string } = { name }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser,
    })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}
