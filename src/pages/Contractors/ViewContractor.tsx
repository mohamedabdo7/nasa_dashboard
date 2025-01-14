import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { getOneContractor, deleteContractor } from "../../services"; // Adjust the import paths as necessary
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import InfoCard from "../../components/UI/InfoCard/InfoCard";
import ActionsMenu from "../../components/UI/ActionsMenu/ActionsMenu";
import { FaExclamationCircle } from "react-icons/fa";
import ImageWithModal from "../../components/ImageWithModal/ImageWithModal";

const ViewContractor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [contractorData, setContractorData] = useState<any>({});

  const breadcrumbItems = [
    { text: t("contractors.contractors") },
    { text: t("contractors.viewContractor") },
  ];

  // Fetch contractor data
  const getContractorHandler = async () => {
    setLoading(true);
    try {
      if (id) {
        const { data } = await getOneContractor(id);
        setContractorData(data);
      }
    } catch (error) {
      showToast(t("toasts.errorFetchingData"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContractorHandler();
  }, [id]);

  // Handle contractor delete
  const confirmDeleteHandler = async (id: string) => {
    try {
      setSubmitLoading(true);
      await deleteContractor(id);
      showToast(t("toasts.contractorDeleted"), "success");
      navigate(routes.CONTRACTORS);
    } catch (error) {
      showToast(t("toasts.errorDeletingContractor"), "error");
    } finally {
      setModalOpen(false);
      setSubmitLoading(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <EasyAccess items={breadcrumbItems} />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <SectionContainer header={t("contractors.contractorInfo")}>
            <ActionsMenu
              onEdit={() => {
                navigate(
                  routes.EDITCONTRACTOR.replace(":id", contractorData.id)
                );
              }}
              onDelete={() => setModalOpen(true)}
              style={{ position: "absolute", top: "10px", right: "10px" }}
            />
            <Row
              className="w-100 justify-content-center mt-3 py-3 rounded-2"
              style={{ backgroundColor: "var(--white-floating)" }}
            >
              <Row>
                <Col lg={12} className="my-2">
                  <ImageWithModal
                    imageUrl="data:image/png;base64,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"
                    name="Example Image"
                    alt="Placeholder"
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.name")}
                    info={contractorData?.nameEn || contractorData?.nameAr}
                  />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.email")}
                    info={contractorData?.email}
                    Icon={<MdEmail />}
                  />
                </Col>
              </Row>
            </Row>
          </SectionContainer>
        </>
      )}

      {/* Reusable Modal Component */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={() => confirmDeleteHandler(contractorData.id)}
        modalTitle={t("contractors.deleteContractor")}
        modalMessage={`${t("settings.deleteMsg")} “${contractorData?.nameEn}“?`}
        confirmBtnText={t("actions.delete")}
        cancelBtnText={t("actions.cancel")}
        loading={submitLoading}
        Icon={<FaExclamationCircle color="#dc3545" size={20} />}
      />
    </Container>
  );
};

export default ViewContractor;
