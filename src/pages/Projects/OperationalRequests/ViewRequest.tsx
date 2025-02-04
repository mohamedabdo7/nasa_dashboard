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
  Stack,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  getOneOperationalRequest,
  getOneOperationalRequestCons,
  getOneOperationalRequestEmp,
  updateRequestStatus,
} from "../../../services";
import { showToast } from "../../../utils";
import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
import InfoCard from "../../../components/UI/InfoCard/InfoCard";
import ImageWithModal from "../../../components/ImageWithModal/ImageWithModal";
import { useAuth } from "../../../context/AuthContext";
import {
  MdCategory,
  MdCheckCircle,
  MdCode,
  MdDescription,
  MdSchedule,
} from "react-icons/md";
import { FaRegCommentDots, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewRequest: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

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

  const getRequestHandler = async () => {
    setLoading(true);
    try {
      if (id) {
        let data;
        if (user.type === "Employee") {
          const response = await getOneOperationalRequestEmp(id);
          data = response.data;
        } else if (user.type === "Consultant") {
          const response = await getOneOperationalRequestCons(id);
          data = response.data;
        } else {
          const response = await getOneOperationalRequest(id);
          data = response.data;
        }
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

  // **Generate and Download PDF**
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Static layout for the header
    doc.setFontSize(16);
    doc.text("AJDAN Project - 45 Villas - RIYADH", 105, 20, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text("WIR (Work Inspection Request)", 105, 30, { align: "center" });

    // Add project logos (optional)
    // doc.addImage('/path/to/logo.png', 'PNG', 10, 10, 40, 20);

    // Draw static fields and dynamic data
    doc.setFontSize(10);
    doc.text("Code:", 20, 50);
    doc.text(requestData.code || "N/A", 50, 50);

    doc.text("Request Type:", 20, 60);
    doc.text(requestData.requestType || "N/A", 50, 60);

    doc.text("Type:", 20, 70);
    doc.text(requestData.type || "N/A", 50, 70);

    doc.text("Description:", 20, 80);
    doc.text(requestData.description || "N/A", 50, 80);

    doc.text("Created At:", 20, 90);
    doc.text(new Date(requestData.createdAt).toLocaleString() || "N/A", 50, 90);

    // Discipline Section
    doc.text("Discipline:", 20, 100);
    doc.text("Structural: ☑", 50, 100);

    // Comments or additional notes section
    if (requestData.consultantComment) {
      doc.text("Consultant Comment:", 20, 120);
      doc.text(requestData.consultantComment, 50, 120, { maxWidth: 140 });
    }

    // Approval comments table
    autoTable(doc, {
      startY: 140,
      head: [["Code", "Approval Comments"]],
      body: [[requestData.code || "N/A", "Approved with comments"]],
    });

    // Save the PDF
    doc.save(`Request-${requestData.id}.pdf`);
  };

  return (
    <Container>
      <EasyAccess items={breadcrumbItems} />

      <Stack
        direction="horizontal"
        className="justify-content-between justify-content-md-end my-3"
      >
        <Button
          variant="primary"
          onClick={handleDownloadPDF}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <FaDownload />
          {t("actions.downloadPDF")}
        </Button>
      </Stack>

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
                      alt={`${t("request image")} ${index + 1}`}
                    />
                  ))}
              </div>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.code")}
                  info={requestData?.code}
                  Icon={<MdCode />}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.type")}
                  info={requestData?.type}
                  Icon={<MdCategory />}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.requestType")}
                  info={requestData?.requestType}
                  Icon={<MdCategory />}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.description")}
                  info={requestData?.description}
                  Icon={<MdDescription />}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.createdAt")}
                  info={new Date(requestData?.createdAt).toLocaleString()}
                  Icon={<MdSchedule />}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <InfoCard
                  heading={t("inputs.status")}
                  info={requestData?.status || t("inputs.noStatus")}
                  Icon={<MdCheckCircle />}
                />
              </Col>
              {requestData.consultantComment && (
                <Col xs={12} md={6} lg={6}>
                  <InfoCard
                    heading={t("inputs.consultantComment")}
                    info={requestData?.consultantComment}
                    Icon={<FaRegCommentDots />}
                  />
                </Col>
              )}
            </Row>
            {/* Buttons for Accept and Reject */}
            {user.type !== "Consultant" && (
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
            )}
          </SectionContainer>
        </>
      )}

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
// import {
//   Container,
//   Row,
//   Col,
//   Spinner,
//   Button,
//   Modal,
//   Form,
//   Stack,
// } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import {
//   getOneOperationalRequest,
//   getOneOperationalRequestCons,
//   getOneOperationalRequestEmp,
//   updateRequestStatus,
// } from "../../../services";
// import { showToast } from "../../../utils";
// import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";
// import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// import InfoCard from "../../../components/UI/InfoCard/InfoCard";
// import ImageWithModal from "../../../components/ImageWithModal/ImageWithModal";
// import { useAuth } from "../../../context/AuthContext";
// import {
//   MdCategory,
//   MdCheckCircle,
//   MdCode,
//   MdDescription,
//   MdSchedule,
// } from "react-icons/md";
// import { FaRegCommentDots, FaDownload } from "react-icons/fa";

// const ViewRequest: React.FC = () => {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [requestData, setRequestData] = useState<any>({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [actionType, setActionType] = useState<boolean>(false);
//   const [consultantComment, setConsultantComment] = useState("");
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const breadcrumbItems = [
//     { text: t("requests.requests") },
//     { text: t("requests.viewRequest") },
//   ];

//   const getRequestHandler = async () => {
//     setLoading(true);
//     try {
//       if (id) {
//         let data;
//         if (user.type === "Employee") {
//           const response = await getOneOperationalRequestEmp(id);
//           data = response.data;
//         } else if (user.type === "Consultant") {
//           const response = await getOneOperationalRequestCons(id);
//           data = response.data;
//         } else {
//           const response = await getOneOperationalRequest(id);
//           data = response.data;
//         }
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

//   const handleAction = async () => {
//     setSubmitLoading(true);
//     try {
//       await updateRequestStatus(id!, actionType, consultantComment);
//       showToast(t(`toasts.request${actionType}Success`), "success");
//       setModalOpen(false);
//       setConsultantComment("");
//       setRequestData((prev: any) => ({ ...prev, status: actionType })); // Update status locally
//     } catch (error) {
//       showToast(t(`toasts.request${actionType}Error`), "error");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   // **Download PDF function**
//   const handleDownloadPDF = async () => {
//     try {
//       // Fetch the PDF file from the server
//       const response = await fetch(`/api/download-pdf/${id}`, {
//         method: "GET",
//         headers: {
//           Accept: "application/pdf",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to download PDF");
//       }

//       // Convert response to a blob
//       const blob = await response.blob();

//       // Create a URL for the blob
//       const blobUrl = window.URL.createObjectURL(blob);

//       // Create an anchor element and trigger the download
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `Request-${id}.pdf`; // Specify the file name
//       document.body.appendChild(link);
//       link.click();

//       // Clean up the URL object and remove the link
//       link.remove();
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       showToast(t("toasts.errorDownloadingPDF"), "error");
//     }
//   };

//   return (
//     <Container>
//       <EasyAccess items={breadcrumbItems} />

//       <Stack direction="horizontal" className="justify-content-between my-3">
//         <h3>{t("requests.requestDetails")}</h3>
//         <Button
//           variant="primary"
//           onClick={handleDownloadPDF}
//           style={{ display: "flex", alignItems: "center", gap: "5px" }}
//         >
//           <FaDownload />
//           {t("actions.downloadPDF")}
//         </Button>
//       </Stack>

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
//                   requestData.images.map((imageUrl: string, index: number) => (
//                     <ImageWithModal
//                       key={index}
//                       imageUrl={imageUrl}
//                       alt={`${t("request image")} ${index + 1}`}
//                     />
//                   ))}
//               </div>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.code")}
//                   info={requestData?.code}
//                   Icon={<MdCode />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.type")}
//                   info={requestData?.type}
//                   Icon={<MdCategory />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.requestType")}
//                   info={requestData?.requestType}
//                   Icon={<MdCategory />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.description")}
//                   info={requestData?.description}
//                   Icon={<MdDescription />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.createdAt")}
//                   info={new Date(requestData?.createdAt).toLocaleString()}
//                   Icon={<MdSchedule />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.status")}
//                   info={requestData?.status || t("inputs.noStatus")}
//                   Icon={<MdCheckCircle />}
//                 />
//               </Col>
//               {requestData.consultantComment && (
//                 <Col xs={12} md={6} lg={6}>
//                   <InfoCard
//                     heading={t("inputs.consultantComment")}
//                     info={requestData?.consultantComment}
//                     Icon={<FaRegCommentDots />}
//                   />
//                 </Col>
//               )}
//             </Row>

//             {/* Buttons for Accept and Reject */}
//             {user.type !== "Consultant" && (
//               <div className="d-flex justify-content-end mt-4 gap-2">
//                 <Button
//                   variant="success"
//                   onClick={() => {
//                     setActionType(true);
//                     setModalOpen(true);
//                   }}
//                 >
//                   {t("actions.accept")}
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => {
//                     setActionType(false);
//                     setModalOpen(true);
//                   }}
//                 >
//                   {t("actions.reject")}
//                 </Button>
//               </div>
//             )}
//           </SectionContainer>
//         </>
//       )}

//       {/* Modal for Adding Consultant Comment */}
//       <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {actionType
//               ? t("actions.acceptRequest")
//               : t("actions.rejectRequest")}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>{t("inputs.consultantComment")}</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={4}
//               value={consultantComment}
//               onChange={(e) => setConsultantComment(e.target.value)}
//               placeholder={t("inputs.addComment")}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setModalOpen(false)}>
//             {t("actions.cancel")}
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleAction}
//             disabled={submitLoading}
//           >
//             {submitLoading ? t("actions.loading") : t("actions.confirm")}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewRequest;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Spinner,
//   Button,
//   Modal,
//   Form,
// } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import {
//   getOneOperationalRequest,
//   getOneOperationalRequestCons,
//   getOneOperationalRequestEmp,
//   updateRequestStatus,
// } from "../../../services";
// import { showToast } from "../../../utils";
// import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";
// import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// import InfoCard from "../../../components/UI/InfoCard/InfoCard";
// import ImageWithModal from "../../../components/ImageWithModal/ImageWithModal";
// import { useAuth } from "../../../context/AuthContext";
// import {
//   MdCategory,
//   MdCheckCircle,
//   MdCode,
//   MdDescription,
//   MdSchedule,
// } from "react-icons/md";
// import { FaRegCommentDots } from "react-icons/fa";

// const ViewRequest: React.FC = () => {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [requestData, setRequestData] = useState<any>({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [actionType, setActionType] = useState<boolean>(false);
//   const [consultantComment, setConsultantComment] = useState("");
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const breadcrumbItems = [
//     { text: t("requests.requests") },
//     { text: t("requests.viewRequest") },
//   ];

//   // Fetch request data
//   const getRequestHandler = async () => {
//     setLoading(true);
//     try {
//       if (id) {
//         let data;
//         if (user.type === "Employee") {
//           const response = await getOneOperationalRequestEmp(id);
//           data = response.data;
//         } else if (user.type === "Consultant") {
//           const response = await getOneOperationalRequestCons(id);
//           data = response.data;
//         } else {
//           const response = await getOneOperationalRequest(id);
//           data = response.data;
//         }
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

//   const handleAction = async () => {
//     setSubmitLoading(true);
//     try {
//       await updateRequestStatus(id!, actionType, consultantComment);
//       showToast(t(`toasts.request${actionType}Success`), "success");
//       setModalOpen(false);
//       setConsultantComment("");
//       setRequestData((prev: any) => ({ ...prev, status: actionType })); // Update status locally
//     } catch (error) {
//       showToast(t(`toasts.request${actionType}Error`), "error");
//     } finally {
//       setSubmitLoading(false);
//     }
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
//                   requestData.images.map((imageUrl: string, index: number) => (
//                     <ImageWithModal
//                       key={index}
//                       imageUrl={imageUrl}
//                       alt={`${t("request image")} ${index + 1}`}
//                     />
//                   ))}
//               </div>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.code")}
//                   info={requestData?.code}
//                   Icon={<MdCode />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.type")}
//                   info={requestData?.type}
//                   Icon={<MdCategory />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.requestType")}
//                   info={requestData?.requestType}
//                   Icon={<MdCategory />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.description")}
//                   info={requestData?.description}
//                   Icon={<MdDescription />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.createdAt")}
//                   info={new Date(requestData?.createdAt).toLocaleString()}
//                   Icon={<MdSchedule />}
//                 />
//               </Col>
//               <Col xs={12} md={6} lg={6}>
//                 <InfoCard
//                   heading={t("inputs.status")}
//                   info={requestData?.status || t("inputs.noStatus")}
//                   Icon={<MdCheckCircle />}
//                 />
//               </Col>
//               {requestData.consultantComment && (
//                 <Col xs={12} md={6} lg={6}>
//                   <InfoCard
//                     heading={t("inputs.consultantComment")}
//                     info={requestData?.consultantComment}
//                     Icon={<FaRegCommentDots />}
//                   />
//                 </Col>
//               )}
//             </Row>

//             {/* Buttons for Accept and Reject */}
//             {user.type !== "Consultant" && (
//               <div className="d-flex justify-content-end mt-4 gap-2">
//                 <Button
//                   variant="success"
//                   onClick={() => {
//                     setActionType(true);
//                     setModalOpen(true);
//                   }}
//                 >
//                   {t("actions.accept")}
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => {
//                     setActionType(false);
//                     setModalOpen(true);
//                   }}
//                 >
//                   {t("actions.reject")}
//                 </Button>
//               </div>
//             )}
//           </SectionContainer>
//         </>
//       )}

//       {/* Modal for Adding Consultant Comment */}
//       <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {actionType
//               ? t("actions.acceptRequest")
//               : t("actions.rejectRequest")}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>{t("inputs.consultantComment")}</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={4}
//               value={consultantComment}
//               onChange={(e) => setConsultantComment(e.target.value)}
//               placeholder={t("inputs.addComment")}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setModalOpen(false)}>
//             {t("actions.cancel")}
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleAction}
//             disabled={submitLoading}
//           >
//             {submitLoading ? t("actions.loading") : t("actions.confirm")}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewRequest;
