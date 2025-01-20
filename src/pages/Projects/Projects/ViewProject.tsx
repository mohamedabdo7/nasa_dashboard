import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  getOneProject,
  deleteProject,
  getOneProjectForEmp,
  getOneProjectForConsultant,
} from "../../../services"; // Update as necessary
import { showToast } from "../../../utils";
import { routes } from "../../../constants";
import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
import InfoCard from "../../../components/UI/InfoCard/InfoCard";
import ActionsMenu from "../../../components/UI/ActionsMenu/ActionsMenu";
import { FaExclamationCircle } from "react-icons/fa";
import ImageWithModal from "../../../components/ImageWithModal/ImageWithModal";
import { useAuth } from "../../../context/AuthContext";

const ViewProject: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<any>({});

  const breadcrumbItems = [
    { text: t("projects.projects"), link: routes.PROJECTS },
    { text: t("projects.viewProject") },
  ];

  // Fetch project details
  const getProjectHandler = async () => {
    setLoading(true);
    try {
      if (id) {
        let data;
        if (user.type === "Admin") {
          const response = await getOneProject(id); // Fetch for Admin
          data = response.data;
        } else if (user.type === "Employee") {
          const response = await getOneProjectForEmp(id); // Fetch for Employee
          data = response.data;
        } else if (user.type === "Consultant") {
          const response = await getOneProjectForConsultant(id); // Fetch for Consultant
          data = response.data;
        }
        setProjectData(data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectHandler();
  }, [id]);

  // Handle project delete
  const confirmDeleteHandler = async (id: string) => {
    try {
      setSubmitLoading(true);
      await deleteProject(id);
      showToast(t("toasts.projectDeleted"), "success");
      navigate(routes.PROJECTS);
    } catch (error) {
      console.error("Error deleting project:", error);
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
          <SectionContainer header={t("projects.projectInfo")}>
            <ActionsMenu
              onEdit={() => {
                navigate(routes.EDITPROJECT.replace(":id", projectData.id));
              }}
              onDelete={() => setModalOpen(true)}
              style={{ position: "absolute", top: "10px", right: "10px" }}
            />
            <Row
              className="w-100 justify-content-center mt-3 py-3 rounded-2"
              style={{ backgroundColor: "var(--white-floating)" }}
            >
              <Row>
                <Col md={12} lg={12} className="mb-3">
                  <ImageWithModal
                    imageUrl={projectData.image}
                    name={projectData.nameEn || projectData.nameAr}
                    alt="Project Image"
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.englishName")}
                    info={projectData.nameEn}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.arabicName")}
                    info={projectData.nameAr}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.location")}
                    info={projectData.location}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.manager")}
                    info={projectData.manager?.name}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.contractor")}
                    info={projectData.mainContractor?.nameEn}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.subContractors")}
                    info={projectData.subContractors
                      ?.map((sc: any) => sc.nameEn)
                      .join(", ")}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("projects.consultant")}
                    info={projectData.consultant?.name}
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
        onConfirm={() => confirmDeleteHandler(projectData.id)}
        modalTitle={t("projects.deleteProject")}
        modalMessage={`${t("projects.deleteMsg")} “${projectData?.nameEn}“?`}
        confirmBtnText={t("actions.delete")}
        cancelBtnText={t("actions.cancel")}
        loading={submitLoading}
        Icon={<FaExclamationCircle color="#dc3545" size={20} />}
      />
    </Container>
  );
};

export default ViewProject;
