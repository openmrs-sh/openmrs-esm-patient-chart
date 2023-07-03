import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { openmrsObservableFetch, showNotification, useVisit, Visit } from '@openmrs/esm-framework';
import styles from './end-visit-dialog.scss';

interface PrintDischargeReportDialogProps {
  patientUuid: string;
  visit: Visit;
  closeModal: () => void;
}

function showInOtherTab(blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}

const PrintDischargeReportDialog: React.FC<PrintDischargeReportDialogProps> = ({ patientUuid, visit, closeModal }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisit(patientUuid);

  const printReport = useCallback(() => {
    const printReportPayload = {
      patientUuid,
      visitUuid: visit ? visit.uuid : currentVisit.uuid,
    };

    const abortController = new AbortController();
    openmrsObservableFetch(
      `/ws//module/report/discharge?patientUuid=${printReportPayload.patientUuid}&visitUuid=${printReportPayload.visitUuid}`,
      {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          'Content-type': 'application/pdf',
          Accept: '*/*',
        },
      },
    ).subscribe(
      (response) => {
        if (response.status === 200) {
          response.blob().then((blob) => showInOtherTab(blob));
        }
      },
      (error) => {
        if (error?.response?.status === 404) {
          showNotification({
            title: t('printDischargeReportErrorMessage', 'There are no gastro encounters for the visit'),
            kind: 'warning',
            critical: false,
            description: error?.message,
          });
        } else
          showNotification({
            title: t('printDischargeReportError', 'Error print discharge report'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
      },
    );
  }, [currentVisit.uuid, patientUuid, t, visit]);

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        label={t('visit', 'Visit')}
        title={t('printDischargeReport', 'Print Discharge Report')}
      />
      <ModalBody>
        <p className={styles.bodyShort02}>
          {t('printDischargeReportWarningMessage', 'You are going to download discharge report for active visit')}.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" onClick={printReport}>
          {t('printReport', 'Print Report')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default PrintDischargeReportDialog;
