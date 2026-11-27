import { useEffect, useState } from 'react';
import {
  ConfirmDialog,
  PageContentSkeleton,
  Toast,
  type ToastMessage,
} from '../../../shared/components/ui';
import { useAuth } from '../../authentication/hooks/useAuth';
import { SawCriteriaTablePanel } from '../components/SawCriteriaTablePanel';
import { SawLiveMatrixAuditor } from '../components/SawLiveMatrixAuditor';
import { SawWeightEditModal } from '../components/SawWeightEditModal';
import {
  INITIAL_ADMIN_CRITERIA,
  spkAdminService,
} from '../services/spkAdmin.service';
import type {
  SawCriterionAdminRecord,
  SawMatrixAuditData,
  SpkTab,
} from '../types/spk.types';

interface SpkRecommendationPageProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function SpkRecommendationPage({
  currentPath = '/admin/spk/kriteria',
  onNavigate,
}: SpkRecommendationPageProps) {
  const activeTab: SpkTab = currentPath.includes('/matriks') ? 'matriks' : 'kriteria';

  const handleTabChange = (tab: SpkTab) => {
    if (onNavigate) {
      if (tab === 'kriteria') onNavigate('/admin/spk/kriteria');
      else if (tab === 'matriks') onNavigate('/admin/spk/matriks');
    }
  };

  // State Criteria & Bobot
  const [criteria, setCriteria] = useState<SawCriterionAdminRecord[]>(INITIAL_ADMIN_CRITERIA);
  const [selectedCriterionForEdit, setSelectedCriterionForEdit] = useState<SawCriterionAdminRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);

  // State Audit Matriks
  const [auditData, setAuditData] = useState<SawMatrixAuditData | null>(null);
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(false);

  // Feedback Toasts & Dialogs
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (type: ToastMessage['type'], text: string) => {
    setToasts((prev) => [
      ...prev,
      { id: 'toast-' + Date.now() + Math.random(), type, text },
    ]);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const { session } = useAuth();
  const accessToken = session?.access_token;

  // Load Criteria & Weights from Backend on Mount
  useEffect(() => {
    let isMounted = true;
    spkAdminService.getActiveSawWeights(accessToken).then((res) => {
      if (isMounted) {
        setCriteria(res.criteria);
        setIsSimulation(res.isSimulation);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  // Load Matrix Audit Data when criteria change
  const refreshMatrix = async (targetCriteria: SawCriterionAdminRecord[] = criteria) => {
    setIsLoadingMatrix(true);
    try {
      const data = await spkAdminService.getLiveMatrixAuditData(targetCriteria, accessToken);
      setAuditData(data);
    } finally {
      setIsLoadingMatrix(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    spkAdminService.getLiveMatrixAuditData(criteria, accessToken).then((data) => {
      if (!isCancelled) {
        setAuditData(data);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [criteria, accessToken]);

  // Handler: Update Bobot Kriteria Lokal dari Modal
  const handleUpdateCriterionWeight = (id: string, newWeight: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: newWeight } : c)),
    );
    showToast('info', `Bobot kriteria ${id} diubah menjadi ${newWeight.toFixed(2)} (Lokal). Periksa total bobot sebelum menyimpan.`);
  };

  // Handler: Simpan Konfigurasi Kriteria & Bobot ke Server (dengan Dialog Konfirmasi)
  const handleRequestSaveWeights = (weightsToSave: SawCriterionAdminRecord[]) => {
    const activeItems = weightsToSave.filter((c) => c.isActive);
    const total = activeItems.reduce((sum, c) => sum + c.weight, 0);
    if (activeItems.length === 0) {
      showToast('error', 'Gagal menyimpan: Minimal harus ada 1 kriteria yang aktif.');
      return;
    }
    if (Math.abs(total - 1.0) > 1e-4) {
      showToast('error', `Gagal menyimpan: Total bobot kriteria aktif harus berjumlah 1,00 (aktual: ${total.toFixed(2)}).`);
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Terapkan Konfigurasi Kriteria & Bobot SAW Baru?',
      description: `Anda akan menyimpan ${weightsToSave.length} kriteria (${activeItems.length} aktif, total bobot 1,00). Perubahan ini akan langsung memengaruhi urutan peringkat rekomendasi e-book di seluruh etalase toko publik.`,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        setIsSaving(true);
        try {
          const res = await spkAdminService.updateSawWeights(
            {
              replaceAll: true,
              criteria: weightsToSave.map((c) => ({
                id: c.id,
                name: c.name,
                field: c.field,
                type: c.type,
                weight: c.isActive ? c.weight : 0,
                isActive: c.isActive,
                description: c.description,
              })),
            },
            accessToken,
          );
          setCriteria(weightsToSave);
          showToast('success', res.message);
          setIsSimulation(res.isSimulation);
          await refreshMatrix(weightsToSave);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Gagal menyimpan bobot';
          showToast('error', msg);
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  // Handler: Reset Default
  const handleResetWeights = () => {
    setCriteria(INITIAL_ADMIN_CRITERIA);
    showToast('info', 'Bobot kriteria dikembalikan ke konfigurasi standar simulasi.');
  };

  return (
    <div className="tf-page-container">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Page Header (Neubrutalism Zona C) */}
      <div className="tf-page-header">
        <div className="tf-title-group">
          <div className="tf-header-title-row">
            <span
              className="tf-badge"
              style={{ backgroundColor: 'var(--nb-lavender)', color: 'var(--nb-black)' }}
            >
              SPK &amp; REKOMENDASI
            </span>
            <span className="tf-badge-zone">ZONA C: PADAT DATA</span>
            {isSimulation && <span className="tf-badge-simulation">DATA SIMULASI</span>}
          </div>
          <h1 className="tf-page-title">Sistem Pendukung Keputusan (Metode SAW)</h1>
          <p className="tf-page-subtitle">
            Pengelolaan Bobot Kriteria Simple Additive Weighting &amp; Live Matrix Auditor Transparansi Rekomendasi E-Book
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs Strip */}
      <div className="tf-nav-tabs" role="tablist" aria-label="Navigasi Submenu SPK SAW">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kriteria'}
          className={`tf-tab-btn ${activeTab === 'kriteria' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('kriteria')}
        >
          <span>Kriteria &amp; Bobot</span>
          <span className="tf-tab-badge">{criteria.length} Kriteria</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'matriks'}
          className={`tf-tab-btn ${activeTab === 'matriks' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('matriks')}
        >
          <span>Audit Matriks SAW</span>
          <span className="tf-tab-badge" style={{ backgroundColor: 'var(--nb-lavender)', color: 'var(--nb-black)' }}>
            Live Engine
          </span>
        </button>
      </div>

      {/* TAB 1: KRITERIA & BOBOT PANEL */}
      {activeTab === 'kriteria' && (
        <SawCriteriaTablePanel
          criteria={criteria}
          onOpenEditModal={(c) => setSelectedCriterionForEdit(c)}
          onSaveAllWeights={handleRequestSaveWeights}
          onResetWeights={handleResetWeights}
          isSaving={isSaving}
        />
      )}

      {/* TAB 2: AUDIT MATRIKS SAW PANEL */}
      {activeTab === 'matriks' &&
        (!auditData || isLoadingMatrix ? (
          <PageContentSkeleton variant="spk" embedded />
        ) : (
          <SawLiveMatrixAuditor
            auditData={auditData}
            onRefreshMatrix={() => void refreshMatrix()}
            isLoading={isLoadingMatrix}
          />
        ))}

      {/* EDIT WEIGHT MODAL */}
      <SawWeightEditModal
        key={selectedCriterionForEdit?.id ?? 'closed'}
        criterion={selectedCriterionForEdit}
        onClose={() => setSelectedCriterionForEdit(null)}
        onUpdateCriterionWeight={handleUpdateCriterionWeight}
      />

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        confirmLabel="Terapkan Bobot Baru"
        confirmVariant="primary"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      >
        <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5 }}>
          {confirmDialog.description}
        </p>
      </ConfirmDialog>
    </div>
  );
}
