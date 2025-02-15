import React, { useEffect, useState } from "react";
import { Stack, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
import { FaRegCommentDots } from "react-icons/fa";

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

  const downloadPDF = () => {
    const tableContainer = document.querySelector(
      ".request-template-container"
    ) as HTMLElement | null;

    if (!tableContainer) return;

    // Temporarily show the table for capture
    tableContainer.style.display = "block";

    // Apply explicit border styles to ensure visibility inside the table
    const style = document.createElement("style");
    style.innerHTML = `
      .request-table, .request-table th, .request-table td {
        border: 1px solid black !important;
        border-collapse: collapse;
      }
    `;
    document.head.appendChild(style);

    // Ensure images are fully loaded before capturing
    const images = tableContainer.querySelectorAll("img");
    const loadPromises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }
        })
    );

    Promise.all(loadPromises).then(() => {
      setTimeout(() => {
        html2canvas(tableContainer as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
          pdf.save("request-details.pdf");

          // Restore original state: Hide the table again
          tableContainer.style.display = "none";

          // Remove added styles after PDF generation
          document.head.removeChild(style);
        });
      }, 500); // Small delay to allow styles to be applied
    });
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
            <Stack direction="horizontal" className="align-items-end" gap={3}>
              <div className="ms-auto">
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={downloadPDF}
                >
                  {t("actions.downloadPDF")}
                </Button>
              </div>
            </Stack>
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
            {user.type === "Consultant" && (
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

      <div className="request-template-container">
        <h3 className="text-center">{requestData?.project?.nameEn}</h3>
        <Table bordered className="request-table">
          <thead>
            <tr>
              <th>
                <img
                  src={
                    import.meta.env.VITE_NASA_URL +
                    requestData?.project?.mainContractor?.image
                  }
                  crossOrigin="anonymous"
                  alt="Client Logo"
                  className="logo"
                />
              </th>
              <th>
                <img
                  src={
                    import.meta.env.VITE_NASA_URL + requestData?.project?.image
                  }
                  crossOrigin="anonymous"
                  alt="Project Logo"
                  className="logo"
                />
              </th>
              <th>
                <img
                  src={
                    import.meta.env.VITE_NASA_URL +
                    requestData?.project?.consultant?.image
                  }
                  crossOrigin="anonymous"
                  alt="Consultant Logo"
                  className="logo"
                />
              </th>
              <th>
                <img
                  src={
                    import.meta.env.VITE_NASA_URL +
                    requestData?.project?.subContractors[0]?.image
                  }
                  crossOrigin="anonymous"
                  alt="Contractor Logo"
                  className="logo"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Client</td>
              <td>Project</td>
              <td>Consultant</td>
              <td>Contractor</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-center">
                <strong>MSR (Material Submittal Request)</strong>
              </td>
            </tr>
            <tr>
              <td>Code</td>
              <td colSpan={3}>{requestData?.code || "N/A"}</td>
            </tr>
            <tr>
              <td>Date of Submittal</td>
              <td colSpan={3}>
                {requestData?.createdAt
                  ? new Date(requestData.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Date of Inspection</td>
              <td colSpan={3}>{requestData?.inspectionDate || "N/A"}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-center">
                <strong>Discipline</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="text-center">
                ( {requestData?.type === "STR" ? "✔" : " "} ) Structural &nbsp;
                ( {requestData?.type === "Arch" ? "✔" : " "} ) Arch &nbsp; ({" "}
                {requestData?.type === "Mech" ? "✔" : " "} ) Mech &nbsp; ({" "}
                {requestData?.type === "Elect" ? "✔" : " "} ) Elect &nbsp; ({" "}
                {requestData?.type === "Finish" ? "✔" : " "} ) Finish
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="text-center">
                <strong>Description of Work</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>{requestData?.description || "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      </div>

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
// import { Table } from "react-bootstrap";

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
//             {user.type === "Consultant" && (
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

//       <div className="request-template-container">
//         <h3 className="text-center">
//           AL Basateen Project - 26 Villas - Jeddah
//         </h3>
//         <Table bordered className="request-table">
//           <thead>
//             <tr>
//               <th>
//                 <img
//                   src={
//                     import.meta.env.VITE_NASA_URL +
//                     requestData?.project?.mainContractor?.image
//                   }
//                   crossOrigin="anonymous"
//                   alt="Client Logo"
//                   className="logo"
//                 />
//               </th>
//               <th>
//                 <img
//                   src={
//                     import.meta.env.VITE_NASA_URL + requestData?.project?.image
//                   }
//                   crossOrigin="anonymous"
//                   alt="Project Logo"
//                   className="logo"
//                 />
//               </th>
//               <th>
//                 <img
//                   src={
//                     import.meta.env.VITE_NASA_URL +
//                     requestData?.project?.consultant?.image
//                   }
//                   crossOrigin="anonymous"
//                   alt="Consultant Logo"
//                   className="logo"
//                 />
//               </th>
//               <th>
//                 <img
//                   src={
//                     import.meta.env.VITE_NASA_URL +
//                     requestData?.project?.subContractors[0]?.image
//                   }
//                   crossOrigin="anonymous"
//                   alt="Contractor Logo"
//                   className="logo"
//                 />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>Client</td>
//               <td>Project</td>
//               <td>Consultant</td>
//               <td>Contractor</td>
//             </tr>
//             <tr>
//               <td colSpan={4} className="text-center">
//                 <strong>MSR (Material Submittal Request)</strong>
//               </td>
//             </tr>
//             <tr>
//               <td>Code</td>
//               <td colSpan={3}>{requestData?.code || "N/A"}</td>
//             </tr>
//             <tr>
//               <td>Date of Submittal</td>
//               <td colSpan={3}>
//                 {requestData?.createdAt
//                   ? new Date(requestData.createdAt).toLocaleDateString()
//                   : "N/A"}
//               </td>
//             </tr>
//             <tr>
//               <td>Date of Inspection</td>
//               <td colSpan={3}>{requestData?.inspectionDate || "N/A"}</td>
//             </tr>
//             <tr>
//               <td colSpan={4} className="text-center">
//                 <strong>Discipline</strong>
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={4} className="text-center">
//                 ( {requestData?.type === "STR" ? "✔" : " "} ) Structural &nbsp;
//                 ( {requestData?.type === "Arch" ? "✔" : " "} ) Arch &nbsp; ({" "}
//                 {requestData?.type === "Mech" ? "✔" : " "} ) Mech &nbsp; ({" "}
//                 {requestData?.type === "Elect" ? "✔" : " "} ) Elect &nbsp; ({" "}
//                 {requestData?.type === "Finish" ? "✔" : " "} ) Finish
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={4} className="text-center">
//                 <strong>Description of Work</strong>
//               </td>
//             </tr>
//             <tr>
//               <td colSpan={4}>{requestData?.description || "N/A"}</td>
//             </tr>
//           </tbody>
//         </Table>
//       </div>

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
