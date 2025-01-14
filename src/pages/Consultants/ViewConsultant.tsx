import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { getOneConsultant, deleteConsultant } from "../../services"; // Adjust the import paths as necessary
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import InfoCard from "../../components/UI/InfoCard/InfoCard";
import ActionsMenu from "../../components/UI/ActionsMenu/ActionsMenu";
import { FaExclamationCircle } from "react-icons/fa";
import ImageWithModal from "../../components/ImageWithModal/ImageWithModal";

const ViewConsultant: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [consultantData, setConsultantData] = useState<any>({});

  const breadcrumbItems = [
    { text: t("consultants.consultants") },
    { text: t("consultants.viewConsultant") },
  ];

  // Fetch consultant data
  const getConsultantHandler = async () => {
    setLoading(true);
    try {
      if (id) {
        const { data } = await getOneConsultant(id);
        setConsultantData(data);
      }
    } catch (error) {
      showToast(t("toasts.errorFetchingData"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConsultantHandler();
  }, [id]);

  // Handle consultant delete
  const confirmDeleteHandler = async (id: string) => {
    try {
      setSubmitLoading(true);
      await deleteConsultant(id);
      showToast(t("toasts.consultantDeleted"), "success");
      navigate(routes.CONSULTANTS);
    } catch (error) {
      showToast(t("toasts.errorDeletingConsultant"), "error");
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
          <SectionContainer header={t("consultants.consultantInfo")}>
            <ActionsMenu
              onEdit={() => {
                navigate(
                  routes.EDITCONSULTANT.replace(":id", consultantData.id)
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
                    imageUrl={consultantData?.image || "/placeholder.jpg"}
                    name={consultantData?.name || ""}
                    alt={consultantData?.name || "Consultant Image"}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.name")}
                    info={consultantData?.name}
                  />
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.email")}
                    info={consultantData?.email}
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
        onConfirm={() => confirmDeleteHandler(consultantData.id)}
        modalTitle={t("consultants.deleteConsultant")}
        modalMessage={`${t("settings.deleteMsg")} “${consultantData?.name}“?`}
        confirmBtnText={t("actions.delete")}
        cancelBtnText={t("actions.cancel")}
        loading={submitLoading}
        Icon={<FaExclamationCircle color="#dc3545" size={20} />}
      />
    </Container>
  );
};

export default ViewConsultant;
