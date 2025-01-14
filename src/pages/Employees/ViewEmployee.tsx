import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { getOneEmployee, deleteEmployee } from "../../services"; // Adjust the import paths as necessary
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import InfoCard from "../../components/UI/InfoCard/InfoCard";
import ActionsMenu from "../../components/UI/ActionsMenu/ActionsMenu";
import { FaExclamationCircle } from "react-icons/fa";

const ViewEmployee: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>({});

  const breadcrumbItems = [
    { text: t("employees.employees") },
    { text: t("employees.viewEmployee") },
  ];

  // Fetch employee data
  const getEmployeeHandler = async () => {
    setLoading(true);
    try {
      if (id) {
        const { data } = await getOneEmployee(id);
        setEmployeeData(data);
      }
    } catch (error) {
      showToast(t("toasts.errorFetchingData"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeHandler();
  }, [id]);

  // Handle employee delete
  const confirmDeleteHandler = async (id: string) => {
    try {
      setSubmitLoading(true);
      await deleteEmployee(id);
      showToast(t("toasts.employeeDeleted"), "success");
      navigate(routes.EMPLOYEES);
    } catch (error) {
      showToast(t("toasts.errorDeletingEmployee"), "error");
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
          <SectionContainer header={t("employees.employeeInfo")}>
            <ActionsMenu
              onEdit={() => {
                navigate(routes.EDITEMPLOYEE.replace(":id", employeeData.id));
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
                  {employeeData.image && (
                    <img
                      src={employeeData.image}
                      alt={employeeData.name}
                      className="employee-image"
                    />
                  )}
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.email")}
                    info={employeeData?.email}
                    Icon={<MdEmail />}
                  />
                </Col>

                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.role")}
                    info={employeeData?.role?.nameEn}
                    Icon={<HiBuildingOffice2 />}
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
        onConfirm={() => confirmDeleteHandler(employeeData.id)}
        modalTitle={t("employees.deleteEmp")}
        modalMessage={`${t("settings.deleteMsg")} “${employeeData?.name}“?`}
        confirmBtnText={t("actions.delete")}
        cancelBtnText={t("actions.cancel")}
        loading={submitLoading}
        Icon={<FaExclamationCircle color="#dc3545" size={20} />}
      />
    </Container>
  );
};

export default ViewEmployee;
