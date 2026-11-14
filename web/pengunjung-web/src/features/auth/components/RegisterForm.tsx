import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff, UserPlus } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { isValidEmail, validatePassword } from '../../../utils/validators';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string | null;
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    acceptTerms?: string | null;
    form?: string | null;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrengthLevel =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : /[A-Z]/.test(password) && /[0-9]/.test(password)
          ? 3
          : 2;

  const passwordStrengthLabel =
    passwordStrengthLevel === 0
      ? 'Belum diisi'
      : passwordStrengthLevel === 1
        ? 'Kurang dari 8 karakter'
        : passwordStrengthLevel === 2
          ? 'Memenuhi syarat dasar (8+ karakter)'
          : 'Kuat (Huruf besar & angka)';

  const validateAll = (): boolean => {
    const nextErrors: typeof errors = {};

    if (fullName.trim().length < 3) {
      nextErrors.fullName = 'Nama lengkap minimal terdiri dari 3 karakter.';
    }
    if (!isValidEmail(email)) {
      nextErrors.email = 'Masukkan alamat email yang valid (contoh: nama@domain.com).';
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      nextErrors.password = pwdError;
    }
    if (!confirmPassword || confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi kata sandi harus sama persis.';
    }
    if (!acceptTerms) {
      nextErrors.acceptTerms =
        'Centang persetujuan syarat pembelian digital untuk melanjutkan.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        confirmPassword,
        acceptTerms,
      });
      navigate(ROUTES.LIBRARY);
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : 'Pendaftaran akun gagal diproses.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewErrors = () => {
    setErrors({
      fullName: 'Contoh validasi: Nama lengkap minimal terdiri dari 3 karakter.',
      email: 'Contoh validasi: Format alamat email belum lengkap.',
      password: 'Contoh validasi: Kata sandi minimal terdiri dari 8 karakter.',
      confirmPassword: 'Contoh validasi: Konfirmasi kata sandi tidak cocok.',
      acceptTerms: 'Contoh validasi: Persetujuan ketentuan wajib dicentang.',
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <div
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
      </div>

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
    </div>
  );
}
