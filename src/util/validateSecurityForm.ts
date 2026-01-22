// 验证逻辑
interface SecurityForm {
  email?: string
  currentPassword?: string
  newPassword?: string
  confirmNewPassword?: string
}

interface ValidationResult {
  isValid: boolean
  errorMessage?: string
  payload?: Record<string, string>
}

export const validateSecurityForm = (
  formData: SecurityForm,
  currentEmail?: string,
): ValidationResult => {
  const payload: Record<string, string> = {}

  /* ========== 邮箱校验 ========== */
  if (formData.email && formData.email !== currentEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return {
        isValid: false,
        errorMessage: '请输入有效的邮箱地址',
      }
    }
    payload.email = formData.email
  }

  /* ========== 密码校验 ========== */
  if (formData.currentPassword || formData.newPassword || formData.confirmNewPassword) {
    if (!formData.currentPassword) {
      return {
        isValid: false,
        errorMessage: '请输入当前密码',
      }
    }

    if (!formData.newPassword) {
      return {
        isValid: false,
        errorMessage: '请输入新密码',
      }
    }

    if (!formData.confirmNewPassword) {
      return {
        isValid: false,
        errorMessage: '请确认新密码',
      }
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      return {
        isValid: false,
        errorMessage: '两次输入的新密码不一致',
      }
    }

    if (formData.newPassword === formData.currentPassword) {
      return {
        isValid: false,
        errorMessage: '新密码不能与当前密码相同',
      }
    }

    payload.currentPassword = formData.currentPassword
    payload.newPassword = formData.newPassword
  }

  /* ========== 是否有更新项 ========== */
  if (Object.keys(payload).length === 0) {
    return {
      isValid: false,
      errorMessage: '请至少修改一项安全设置',
    }
  }

  return {
    isValid: true,
    payload,
  }
}
