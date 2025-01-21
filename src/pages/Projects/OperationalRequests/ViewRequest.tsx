import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  getOneOperationalRequest,
  updateRequestStatus,
} from "../../../services";
import { showToast } from "../../../utils";
import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
import InfoCard from "../../../components/UI/InfoCard/InfoCard";
import ImageWithModal from "../../../components/ImageWithModal/ImageWithModal";

const ViewRequest: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState<any>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<boolean>(false);
  const [consultantComment, setConsultantComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const breadcrumbItems = [
    { text: t("requests.requests") },
    { text: t("requests.viewRequest") },
  ];

  // Fetch request data
  const getRequestHandler = async () => {
    setLoading(true);
    try {
      if (id) {
        const { data } = await getOneOperationalRequest(id);
        setRequestData(data);
      }
    } catch (error) {
      showToast(t("toasts.errorFetchingData"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequestHandler();
  }, [id]);

  const handleAction = async () => {
    setSubmitLoading(true);
    try {
      await updateRequestStatus(id!, actionType, consultantComment);
      showToast(t(`toasts.request${actionType}Success`), "success");
      setModalOpen(false);
      setConsultantComment("");
      setRequestData((prev: any) => ({ ...prev, status: actionType })); // Update status locally
    } catch (error) {
      showToast(t(`toasts.request${actionType}Error`), "error");
    } finally {
      setSubmitLoading(false);
    }
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
          <SectionContainer header={t("requests.requestInfo")}>
            <Row
              className="w-100 justify-content-center mt-3 py-3 rounded-2"
              style={{ backgroundColor: "var(--white-floating)" }}
            >
              <div className="d-flex gap-4 my-3">
                {requestData.images &&
                  requestData.images.map((imageUrl: string, index: number) => (
                    <ImageWithModal
                      key={index}
                      imageUrl={imageUrl}
                      alt={`${t("requests.requestImage")} ${index + 1}`}
                    />
                  ))}
              </div>
              <Col xs={12} md={6} lg={6}>
                <InfoCard heading={t("inputs.code")} info={requestData?.code} />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard heading={t("inputs.type")} info={requestData?.type} />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.requestType")}
                  info={requestData?.requestType}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.description")}
                  info={requestData?.description}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.createdAt")}
                  info={new Date(requestData?.createdAt).toLocaleString()}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.status")}
                  info={requestData?.status || t("inputs.noStatus")}
                />
              </Col>
              {requestData.consultantComment && (
                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.consultantComment")}
                    info={requestData?.consultantComment}
                  />
                </Col>
              )}
            </Row>

            {/* Buttons for Accept and Reject */}
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button
                variant="success"
                onClick={() => {
                  setActionType(true);
                  setModalOpen(true);
                }}
              >
                {t("actions.accept")}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setActionType(false);
                  setModalOpen(true);
                }}
              >
                {t("actions.reject")}
              </Button>
            </div>
          </SectionContainer>
        </>
      )}

      {/* Modal for Adding Consultant Comment */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType
              ? t("actions.acceptRequest")
              : t("actions.rejectRequest")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t("inputs.consultantComment")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={consultantComment}
              onChange={(e) => setConsultantComment(e.target.value)}
              placeholder={t("inputs.addComment")}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            {t("actions.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleAction}
            disabled={submitLoading}
          >
            {submitLoading ? t("actions.loading") : t("actions.confirm")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewRequest;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Spinner } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import { getOneOperationalRequest } from "../../../services";
// import { showToast } from "../../../utils";
// import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";
// import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// import InfoCard from "../../../components/UI/InfoCard/InfoCard";
// import ModalComponent from "../../../components/ModalComponent/ModalComponent";
// import { FaExclamationCircle } from "react-icons/fa";
// import ImageWithModal from "../../../components/ImageWithModal/ImageWithModal";

// const ViewRequest: React.FC = () => {
//   const { t } = useTranslation();
//   // const navigate = useNavigate();
//   const { id } = useParams();

//   const [loading, setLoading] = useState(false);
//   const [submitLoading, _] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [requestData, setRequestData] = useState<any>({});

//   const breadcrumbItems = [
//     { text: t("requests.requests") },
//     { text: t("requests.viewRequest") },
//   ];

//   // Fetch request data
//   const getRequestHandler = async () => {
//     setLoading(true);
//     try {
//       if (id) {
//         const { data } = await getOneOperationalRequest(id);
//         setRequestData(data);
//       }
//     } catch (error) {
//       showToast(t("toasts.errorFetchingData"), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getRequestHandler();
//   }, [id]);

//   const handleModalClose = () => {
//     setModalOpen(false);
//   };

//   return (
//     <Container>
//       <EasyAccess items={breadcrumbItems} />
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" />
//         </div>
//       ) : (
//         <>
//           <SectionContainer header={t("requests.requestInfo")}>
//             <Row
//               className="w-100 justify-content-center mt-3 py-3 rounded-2"
//               style={{ backgroundColor: "var(--white-floating)" }}
//             >
//               <div className="d-flex gap-4 my-3">
//                 {requestData.images &&
//                   requestData.images.length > 0 &&
//                   requestData.images.map((imageUrl: string, index: number) => (
//                     // <Col lg={2} className="my-2" key={index}>
//                     <ImageWithModal
//                       imageUrl={imageUrl}
//                       alt={`${t("requests.requestImage")} ${index + 1}`}
//                     />
//                     // </Col>
//                   ))}
//               </div>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard heading={t("inputs.code")} info={requestData?.code} />
//               </Col>

//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard heading={t("inputs.type")} info={requestData?.type} />
//               </Col>

//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.requestType")}
//                   info={requestData?.requestType}
//                 />
//               </Col>

//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.description")}
//                   info={requestData?.description}
//                 />
//               </Col>

//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.createdAt")}
//                   info={new Date(requestData?.createdAt).toLocaleString()}
//                 />
//               </Col>

//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.status")}
//                   info={requestData?.status || t("inputs.noStatus")}
//                 />
//               </Col>

//               {requestData.consultantComment && (
//                 <Col xs={12} md={6} lg={6}>
//                   <InfoCard
//                     heading={t("inputs.consultantComment")}
//                     info={requestData?.consultantComment}
//                   />
//                 </Col>
//               )}
//             </Row>
//           </SectionContainer>
//         </>
//       )}

//       {/* Reusable Modal Component */}
//       <ModalComponent
//         isOpen={isModalOpen}
//         onClose={handleModalClose}
//         onConfirm={() => console.log("Delete request", requestData.id)}
//         modalTitle={t("requests.deleteRequest")}
//         modalMessage={`${t("settings.deleteMsg")}: ${requestData?.code}`}
//         confirmBtnText={t("actions.delete")}
//         cancelBtnText={t("actions.cancel")}
//         loading={submitLoading}
//         Icon={<FaExclamationCircle color="#dc3545" size={20} />}
//       />
//     </Container>
//   );
// };

// export default ViewRequest;
