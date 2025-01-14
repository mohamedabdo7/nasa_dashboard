import React from "react";
import { getEmployees } from "../../../services";
import AsyncSelectDropdown from "../../../components/PaginatedSelect/PaginatedSelect";

const AddProject = () => {
  const fetchEngineers = async (searchTerm, page) => {
    try {
      const response = await getEmployees({
        pageNumber: page,
        limit: 10,
        search: searchTerm,
      });
      console.log("response", response);
      return response.data.rows.map((item) => ({
        value: item._id,
        label: item.name,
      }));
    } catch (error) {
      console.error("Error fetching engineers:", error);
      return [];
    }
  };

  return (
    <div>
      <h1>Add Project</h1>
      <AsyncSelectDropdown fetchOptions={fetchEngineers} />
    </div>
  );
};

export default AddProject;

// import React, { useEffect, useState } from "react";
// import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// import { Col, Row } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import { useFormik } from "formik";
// import Input from "../../../components/UI/Input/Input";
// import Button from "../../../components/UI/Button";
// import * as Yup from "yup";
// import { showToast } from "../../../utils";
// import { routes } from "../../../constants";
// import { useNavigate } from "react-router-dom";
// import {
//   getEmployees,
//   getContractors,
//   getConsultants,
//   createProject,
// } from "../../../services";
// import PaginatedSelect from "../../../components/PaginatedSelect/PaginatedSelect";

// const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// const AddProject: React.FC = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const validationSchema = Yup.object().shape({
//     arabicName: Yup.string().required(t("validation.arabicNameRequired")),
//     englishName: Yup.string().required(t("validation.englishNameRequired")),
//     location: Yup.string().required(t("validation.locationRequired")),
//     description: Yup.string().required(t("validation.descriptionRequired")),
//     startDate: Yup.date().required(t("validation.startDateRequired")),
//     endDate: Yup.date()
//       .required(t("validation.endDateRequired"))
//       .min(Yup.ref("startDate"), t("validation.endDateAfterStart")),
//     projectManager: Yup.object()
//       .nullable()
//       .required(t("validation.managerRequired")),
//     engineers: Yup.array()
//       .of(Yup.object().nullable())
//       .min(1, t("validation.engineersRequired")),
//     contractor: Yup.object()
//       .nullable()
//       .required(t("validation.contractorRequired")),
//     subContractors: Yup.array()
//       .of(Yup.object().nullable())
//       .min(1, t("validation.subContractorsRequired")),
//     consultant: Yup.object()
//       .nullable()
//       .required(t("validation.consultantRequired")),
//     images: Yup.array()
//       .of(
//         Yup.mixed()
//           .test(
//             "fileSize",
//             t("validation.maxImageSize"),
//             (file) => !file || file.size <= MAX_IMAGE_SIZE
//           )
//           .test(
//             "fileFormat",
//             t("validation.imageType"),
//             (file) =>
//               !file ||
//               ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
//           )
//       )
//       .optional(),
//   });

//   const formik = useFormik({
//     initialValues: {
//       arabicName: "",
//       englishName: "",
//       location: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       projectManager: null,
//       engineers: [],
//       contractor: null,
//       subContractors: [],
//       consultant: null,
//       images: [],
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const payload = {
//           ...values,
//           engineers: values.engineers.map((eng: any) => eng.value),
//           subContractors: values.subContractors.map((sub: any) => sub.value),
//           projectManager: values.projectManager?.value,
//           contractor: values.contractor?.value,
//           consultant: values.consultant?.value,
//         };
//         await createProject(payload);
//         showToast(t("projects.projectCreated"), "success");
//         navigate(routes.PROJECTS);
//       } catch (error) {
//         console.error("Error creating project:", error);
//         showToast(t("projects.createFailed"), "error");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   const fetchEngineers = async (search: string, page: number) => {
//     console.log("Fetching engineers:", { search, page }); // Debug log
//     try {
//       const response = await getEmployees({ pageNumber: page, limit: 10 });
//       console.log("Engineer Response:", response); // Log response
//       return {
//         options: response.data.rows.map((eng: any) => ({
//           value: eng.id,
//           label: eng.name,
//         })),
//         hasMore: response.data.next !== null,
//       };
//     } catch (error) {
//       console.error("Error fetching engineers:", error);
//       return { options: [], hasMore: false };
//     }
//   };

//   const fetchContractors = async (search: string, page: number) => {
//     try {
//       const response = await getContractors({ pageNumber: page, limit: 10 });
//       return {
//         options: response.data.rows.map((cont: any) => ({
//           value: cont.id,
//           label: cont.nameEn,
//         })),
//         hasMore: response.data.next !== null,
//       };
//     } catch (error) {
//       console.error("Error fetching contractors:", error);
//       return { options: [], hasMore: false };
//     }
//   };

//   const fetchConsultants = async (search: string, page: number) => {
//     try {
//       const response = await getConsultants({ pageNumber: page, limit: 10 });
//       return {
//         options: response.data.rows.map((cons: any) => ({
//           value: cons.id,
//           label: cons.name,
//         })),
//         hasMore: response.data.next !== null,
//       };
//     } catch (error) {
//       console.error("Error fetching consultants:", error);
//       return { options: [], hasMore: false };
//     }
//   };

//   return (
//     <div className="w-100">
//       <form onSubmit={formik.handleSubmit}>
//         <SectionContainer header={t("projects.projectInfo")}>
//           <Row className="gy-3">
//             <Col md={6}>
//               <Input
//                 type="text"
//                 required
//                 formik={formik}
//                 labelName={t("projects.arabicName")}
//                 name="arabicName"
//                 placeholder={t("projects.arabicNamePlaceholder")}
//               />
//             </Col>
//             <Col md={6}>
//               <Input
//                 type="text"
//                 required
//                 formik={formik}
//                 labelName={t("projects.englishName")}
//                 name="englishName"
//                 placeholder={t("projects.englishNamePlaceholder")}
//               />
//             </Col>
//             <Col md={12}>
//               <Input
//                 type="text"
//                 required
//                 formik={formik}
//                 labelName={t("projects.location")}
//                 name="location"
//                 placeholder={t("projects.locationPlaceholder")}
//               />
//             </Col>
//             <Col md={6}>
//               <Input
//                 type="date"
//                 required
//                 formik={formik}
//                 labelName={t("projects.startDate")}
//                 name="startDate"
//               />
//             </Col>
//             <Col md={6}>
//               <Input
//                 type="date"
//                 required
//                 formik={formik}
//                 labelName={t("projects.endDate")}
//                 name="endDate"
//               />
//             </Col>
//             <Col md={6}>
//               <PaginatedSelect
//                 fetchOptions={fetchEngineers}
//                 value={formik.values.projectManager}
//                 onChange={(value) =>
//                   formik.setFieldValue("projectManager", value)
//                 }
//                 placeholder={t("projects.projectManagerPlaceholder")}
//               />
//             </Col>
//             <Col md={6}>
//               <PaginatedSelect
//                 fetchOptions={fetchEngineers}
//                 isMulti
//                 value={formik.values.engineers}
//                 onChange={(value) => formik.setFieldValue("engineers", value)}
//                 placeholder={t("projects.engineersPlaceholder")}
//               />
//             </Col>
//             <Col md={6}>
//               <PaginatedSelect
//                 fetchOptions={fetchContractors}
//                 value={formik.values.contractor}
//                 onChange={(value) => formik.setFieldValue("contractor", value)}
//                 placeholder={t("projects.contractorPlaceholder")}
//               />
//             </Col>
//             <Col md={6}>
//               <PaginatedSelect
//                 fetchOptions={fetchContractors}
//                 isMulti
//                 value={formik.values.subContractors}
//                 onChange={(value) =>
//                   formik.setFieldValue("subContractors", value)
//                 }
//                 placeholder={t("projects.subContractorsPlaceholder")}
//               />
//             </Col>
//             <Col md={6}>
//               <PaginatedSelect
//                 fetchOptions={fetchConsultants}
//                 value={formik.values.consultant}
//                 onChange={(value) => formik.setFieldValue("consultant", value)}
//                 placeholder={t("projects.consultantPlaceholder")}
//               />
//             </Col>
//             <Col md={12}>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/jpeg,image/jpg,image/png"
//                 onChange={(e) => {
//                   const files = Array.from(e.target.files || []);
//                   formik.setFieldValue("images", files);
//                 }}
//               />
//             </Col>
//           </Row>
//         </SectionContainer>
//         <div className="m-3">
//           <Row className="justify-content-end g-3">
//             <Col md={3}>
//               <Button text={t("buttons.add")} type="submit" loading={loading} />
//             </Col>
//             <Col md={3}>
//               <Button
//                 text={t("actions.cancel")}
//                 styleType="outline"
//                 onClick={() => navigate(routes.PROJECTS)}
//               />
//             </Col>
//           </Row>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProject;
