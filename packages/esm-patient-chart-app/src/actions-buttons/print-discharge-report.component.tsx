import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showModal, useConfig, useVisit } from '@openmrs/esm-framework';

interface PrintDischargeReportOverflowMenuItemProps {
  patientUuid: string;
}

const PrintDischargeReportOverflowMenuItem: React.FC<PrintDischargeReportOverflowMenuItemProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisit(patientUuid);
  const { endVisitLabel } = useConfig();

  const openModal = useCallback(() => {
    const dispose = showModal('print-discharge-report-dialog', {
      closeModal: () => dispose(),
      patientUuid,
    });
  }, [patientUuid]);

  return (
    currentVisit && (
      <li className="cds--overflow-menu-options__option">
        <button
          className="cds--overflow-menu-options__btn"
          role="menuitem"
          title={endVisitLabel ? endVisitLabel : `${t('printDischargeReport', 'Print Discharge Report')}`}
          data-floating-menu-primary-focus
          onClick={openModal}
          style={{
            maxWidth: '100vw',
          }}
        >
          <span className="cds--overflow-menu-options__option-content">
            {endVisitLabel ? endVisitLabel : <>{t('printDischargeReport', 'Print Discharge Report')}</>}
          </span>
        </button>
      </li>
    )
  );
};

export default PrintDischargeReportOverflowMenuItem;
