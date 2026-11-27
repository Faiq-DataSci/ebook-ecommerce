import { Link } from 'react-router-dom';
import { Check, Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ROUTES } from '../../../constants/routes';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { useRegisterForm } from '../hooks/useRegisterForm';

const authContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

const authBannerVariants: Variants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const authCardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function RegisterForm() {
  const reduceMotion = useReducedMotion();
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptTerms,
    setAcceptTerms,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    setErrors,
    isSubmitting,
    passwordStrengthLevel,
    passwordStrengthLabel,
    handleSubmit,
    handlePreviewErrors,
  } = useRegisterForm();

  return (
    <motion.div
      style={{ width: '100%', maxWidth: '560px' }}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={authContainerVariants}
    >
      <motion.div
        variants={authBannerVariants}
        style={{
          backgroundColor: 'var(--nb-blue)',
          border: 'var(--nb-border-thick)',
          boxShadow: 'var(--nb-shadow-lg)',
          padding: 'var(--nb-space-5)',
          marginBottom: 'var(--nb-space-5)',
          transform: 'rotate(0.7deg)',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <SimulationBadge />
        </div>
        <h1 className="nb-h1">Registrasi Pelanggan Baru</h1>
        <p className="nb-body-sm" style={{ marginTop: '4px' }}>
          Buat akun pelanggan untuk memesan e-book digital dan menyimpan hak
          akses baca di Pustaka Saya. Hanya meminta data yang relevan.
        </p>
      </motion.div>

      <motion.div variants={authCardVariants}>
        <Card tone="white" zone="C" padding="lg">
        <form
          noValidate
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--nb-space-4)',
          }}
        >
          {errors.form && (
            <div
              role="alert"
              style={{
                backgroundColor: 'var(--nb-pink)',
                border: 'var(--nb-border-thin)',
                padding: 'var(--nb-space-3)',
              }}
            >
              <p className="nb-body-sm" style={{ fontWeight: 700 }}>
                {errors.form}
              </p>
            </div>
          )}

          <Input
            label="Nama Lengkap"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
            }}
            placeholder="Nama Lengkap Anda"
            error={errors.fullName}
          />

          <Input
            label="Alamat Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            placeholder="email@domain.com"
            error={errors.email}
          />

          <Input
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="Minimal 8 karakter"
            error={errors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? 'Sembunyikan kata sandi'
                    : 'Tampilkan kata sandi'
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '44px',
                  minHeight: '44px',
                  backgroundColor: 'var(--nb-paper)',
                  border: 'var(--nb-border-thin)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2.25} aria-hidden="true" />
                ) : (
                  <Eye size={18} strokeWidth={2.25} aria-hidden="true" />
                )}
              </button>
            }
          />

          <div
            aria-live="polite"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  style={{
                    height: '10px',
                    border: 'var(--nb-border-thin)',
                    backgroundColor:
                      passwordStrengthLevel >= step
                        ? step === 1
                          ? 'var(--nb-pink)'
                          : step === 2
                            ? 'var(--nb-yellow)'
                            : 'var(--nb-green)'
                        : 'var(--nb-muted)',
                  }}
                />
              ))}
            </div>
            <span className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
              Status kata sandi: {passwordStrengthLabel}
            </span>
          </div>

          <Input
            label="Konfirmasi Kata Sandi"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }
            }}
            placeholder="Ketik ulang kata sandi"
            error={errors.confirmPassword}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? 'Sembunyikan konfirmasi kata sandi'
                    : 'Tampilkan konfirmasi kata sandi'
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '44px',
                  minHeight: '44px',
                  backgroundColor: 'var(--nb-paper)',
                  border: 'var(--nb-border-thin)',
                  cursor: 'pointer',
                }}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} strokeWidth={2.25} aria-hidden="true" />
                ) : (
                  <Eye size={18} strokeWidth={2.25} aria-hidden="true" />
                )}
              </button>
            }
          />

          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                paddingBlock: '4px',
              }}
            >
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.acceptTerms) {
                    setErrors((prev) => ({ ...prev, acceptTerms: null }));
                  }
                }}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 1,
                  height: 1,
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  width: '24px',
                  height: '24px',
                  flexShrink: 0,
                  border: 'var(--nb-border-thin)',
                  backgroundColor: acceptTerms
                    ? 'var(--nb-yellow)'
                    : 'var(--nb-white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}
              >
                {acceptTerms && <Check size={16} strokeWidth={3} />}
              </span>
              <span className="nb-body-sm">
                Saya memahami bahwa akses e-book digital hanya diberikan setelah
                status pembayaran terverifikasi (Aturan Bisnis E-Book Store).
              </span>
            </label>

            {errors.acceptTerms && (
              <p
                role="alert"
                className="nb-body-sm"
                style={{
                  marginTop: '6px',
                  backgroundColor: 'var(--nb-pink)',
                  border: 'var(--nb-border-thin)',
                  padding: '6px 10px',
                  fontWeight: 600,
                }}
              >
                {errors.acceptTerms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<UserPlus size={20} strokeWidth={2.25} aria-hidden="true" />}
          >
            Daftar Akun Pelanggan
          </Button>

          <div
            style={{
              borderTop: 'var(--nb-border-thin)',
              paddingTop: 'var(--nb-space-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <Button variant="secondary" onClick={handlePreviewErrors}>
              Uji State Validasi Form
            </Button>

            <p className="nb-body-sm">
              Sudah punya akun?{' '}
              <Link
                to={ROUTES.LOGIN}
                style={{
                  fontWeight: 700,
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </form>
      </Card>
      </motion.div>
    </motion.div>
  );
}
