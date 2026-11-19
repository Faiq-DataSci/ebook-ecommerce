import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Eye, EyeOff, KeyRound, LogIn } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ROUTES } from '../../../constants/routes';
import { isValidEmail, validatePassword } from '../../../utils/validators';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';

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

export function LoginForm() {
  const { login, loginWithDemoAccount } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || ROUTES.LIBRARY;
  const reduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);

  const validateFields = (): boolean => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('Alamat email wajib diisi.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Masukkan format email yang benar, contoh: nama@domain.com');
      valid = false;
    } else {
      setEmailError(null);
    }

    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setPasswordError(pwdErr);
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(redirectTarget);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Gagal masuk ke akun pelanggan.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
    setIsSubmitting(true);
    try {
      await loginWithDemoAccount();
      navigate(redirectTarget);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewValidationError = () => {
    setEmail('format-email-tidak-valid');
    setPassword('123');
    setEmailError('Contoh validasi: format email belum menyertakan domain.');
    setPasswordError('Contoh validasi: kata sandi minimal terdiri dari 8 karakter.');
    setFormError(
      'Contoh pesan gagal otentikasi: Email atau kata sandi salah (DATA SIMULASI).',
    );
  };

  return (
    <motion.div
      style={{ width: '100%', maxWidth: '520px' }}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={authContainerVariants}
    >
      <motion.div
        variants={authBannerVariants}
        style={{
          backgroundColor: 'var(--nb-yellow)',
          border: 'var(--nb-border-thick)',
          boxShadow: 'var(--nb-shadow-lg)',
          padding: 'var(--nb-space-5)',
          marginBottom: 'var(--nb-space-5)',
          transform: 'rotate(-0.8deg)',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <SimulationBadge />
        </div>
        <h1 className="nb-h1">Masuk Akun Pelanggan</h1>
        <p className="nb-body-sm" style={{ marginTop: '4px' }}>
          Akses koleksi e-book yang telah Anda beli dan pantau status verifikasi
          pesanan Anda. Layar ini khusus untuk pelanggan (bukan login admin).
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
          {formError && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                backgroundColor: 'var(--nb-pink)',
                border: 'var(--nb-border-thin)',
                padding: 'var(--nb-space-3)',
              }}
            >
              <AlertTriangle
                size={20}
                strokeWidth={2.25}
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <p className="nb-body-sm" style={{ fontWeight: 700 }}>
                {formError}
              </p>
            </div>
          )}

          <Input
            label="Alamat Email Pelanggan"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            onBlur={() => {
              if (email && !isValidEmail(email)) {
                setEmailError('Masukkan format email yang benar, contoh: nama@domain.com');
              }
            }}
            placeholder="email@domain.com"
            hint="Gunakan email akun pelanggan terdaftar."
            error={emailError}
          />

          <Input
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="Minimal 8 karakter"
            error={passwordError}
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
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="ghost"
              onClick={() => setRecoveryModalOpen(true)}
            >
              Lupa Kata Sandi?
            </Button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<LogIn size={20} strokeWidth={2.25} aria-hidden="true" />}
          >
            Masuk ke Akun Pelanggan
          </Button>

          <div
            style={{
              borderTop: 'var(--nb-border-thin)',
              paddingTop: 'var(--nb-space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--nb-space-2)',
            }}
          >
            <span className="nb-label">Alat Bantu Simulasi & Pengujian UI:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button
                variant="blue"
                onClick={handleDemoLogin}
                leftIcon={<KeyRound size={16} strokeWidth={2.25} aria-hidden="true" />}
              >
                Masuk Cepat Akun Contoh (DATA SIMULASI)
              </Button>
              <Button
                variant="secondary"
                onClick={handlePreviewValidationError}
              >
                Tampilkan Contoh State Error
              </Button>
            </div>
          </div>

          <p
            className="nb-body-sm"
            style={{
              textAlign: 'center',
              borderTop: 'var(--nb-border-thin)',
              paddingTop: 'var(--nb-space-3)',
            }}
          >
            Belum memiliki akun pelanggan?{' '}
            <Link
              to={ROUTES.REGISTER}
              style={{
                fontWeight: 700,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Daftar Akun Baru
            </Link>
          </p>
        </form>
      </Card>
      </motion.div>

      <Modal
        isOpen={recoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
        title="Pemulihan Kata Sandi Pelanggan"
        footer={
          <Button variant="primary" onClick={() => setRecoveryModalOpen(false)}>
            Tutup Informasi
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SimulationBadge />
          <p className="nb-body">
            Fitur pengiriman tautan reset kata sandi akan terhubung ke layanan
            autentikasi backend (Supabase Auth) pada implementasi produksi.
          </p>
          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
            Untuk menguji area pelanggan pada pratinjau ini, silakan gunakan
            tombol Masuk Cepat Akun Contoh pada formulir login.
          </p>
        </div>
      </Modal>
    </motion.div>
  );
}
