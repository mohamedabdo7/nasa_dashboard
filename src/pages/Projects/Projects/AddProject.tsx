import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import {
  getEmployees,
  getContractors,
  getConsultants,
  createProject, // Import the service
} from "../../../services";

import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// import CustomDatePicker from "../../../components/CustomDatepicker/CustomDatepicker";
import PaginatedSelect from "../../../components/PaginatedSelect/PaginatedSelect";
import NewImage from "../../../components/UI/ImageInput/ImageInput";
import { showToast } from "../../../utils"; // For notifications
import { useNavigate } from "react-router-dom";
import { routes } from "../../../constants";

// Define Option and FormValues interfaces
interface Option {
  value: string | number;
  label: string;
}

interface FormValues {
  arabicName: string;
  englishName: string;
  location: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  projectManager: Option | null;
  engineers: Option[];
  contractor: Option | null;
  subContractors: Option[];
  consultant: Option | null;
  image: string; // Uploaded image path
  code: string;
}

const AddProject: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // States for options
  const [engineers, setEngineers] = useState<Option[]>([]);
  const [contractors, setContractors] = useState<Option[]>([]);
  const [consultants, setConsultants] = useState<Option[]>([]);

  // Function to fetch options
  const fetchOptions = async (
    service: any,
    page: number,
    search = "",
    excludeIds: (string | number)[] = [] // Accept multiple exclusions
  ): Promise<Option[]> => {
    const response = await service({
      pageNumber: page,
      limit: 10,
      search,
    });

    const data = response.data.rows;
    return data
      .filter((item: any) => !excludeIds.includes(item.id)) // Exclude all specified IDs
      .map((item: any) => ({
        value: item.id,
        label: item.name || `${item.nameEn} (${item.nameAr})`,
      }));
  };

  // Load initial options
  useEffect(() => {
    const loadInitialOptions = async () => {
      const [engineersOptions, contractorsOptions, consultantsOptions] =
        await Promise.all([
          fetchOptions(getEmployees, 1),
          fetchOptions(getContractors, 1),
          fetchOptions(getConsultants, 1),
        ]);

      setEngineers(engineersOptions);
      setContractors(contractorsOptions);
      setConsultants(consultantsOptions);
    };

    loadInitialOptions();
  }, []);

  // Validation schema
  const validationSchema = Yup.object().shape({
    arabicName: Yup.string().required(
      t("projects.validation.arabicNameRequired")
    ),
    englishName: Yup.string().required(
      t("projects.validation.englishNameRequired")
    ),
    location: Yup.string().required(t("projects.validation.locationRequired")),
    description: Yup.string().required(
      t("projects.validation.descriptionRequired")
    ),
    // startDate: Yup.date().required(t("projects.validation.startDateRequired")),
    // endDate: Yup.date()
    //   .required(t("projects.validation.endDateRequired"))
    //   .min(Yup.ref("startDate"), t("projects.validation.endDateAfterStart")),
    projectManager: Yup.object()
      .nullable()
      .required(t("projects.validation.managerRequired")),
    engineers: Yup.array().min(1, t("projects.validation.engineersRequired")),
    contractor: Yup.object()
      .nullable()
      .required(t("projects.validation.contractorRequired")),
    subContractors: Yup.array().min(
      1,
      t("projects.validation.subContractorsRequired")
    ),
    consultant: Yup.object()
      .nullable()
      .required(t("projects.validation.consultantRequired")),
    image: Yup.string().required(t("projects.validation.imageRequired")),
  });

  // Formik setup
  const formik = useFormik<FormValues>({
    initialValues: {
      arabicName: "",
      englishName: "",
      location: "",
      description: "",
      startDate: null,
      endDate: null,
      projectManager: null,
      engineers: [],
      contractor: null,
      subContractors: [],
      consultant: null,
      image: "",
      code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          nameAr: values.arabicName,
          nameEn: values.englishName,
          location: values.location,
          description: values.description,
          // startDate: values.startDate?.toISOString(),
          // endDate: values.endDate?.toISOString(),
          managerId: values.projectManager?.value as string,
          engineersIds: values.engineers.map((e) => e.value as string),
          contractorId: values.contractor?.value as string,
          subCotractorId: values.subContractors.map((sc) => sc.value as string),
          consultantId: values.consultant?.value as string,
          image: values.image,
          code: values.code,
        };

        await createProject(payload);
        showToast(t("projects.projectCreated"), "success"); // Show success toast
        setLoading(false);
        navigate(routes.PROJECTS);
      } catch (error) {
        console.error("Error creating project:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <SectionContainer header={t("projects.addProject")}>
        <Row className="gy-3">
          {/* Form fields */}
          <Col md={6}>
            <Input
              formik={formik}
              name="arabicName"
              labelName={t("projects.arabicName")}
              placeholder={t("projects.arabicNamePlaceholder")}
            />
          </Col>
          <Col md={6}>
            <Input
              formik={formik}
              name="englishName"
              labelName={t("projects.englishName")}
              placeholder={t("projects.englishNamePlaceholder")}
            />
          </Col>
          <Col md={6}>
            <Input
              formik={formik}
              name="location"
              labelName={t("projects.location")}
              placeholder={t("projects.locationPlaceholder")}
            />
          </Col>
          <Col md={6}>
            <Input
              formik={formik}
              name="code"
              labelName={t("projects.code")}
              placeholder={t("projects.codePlaceholder")}
            />
          </Col>
          <Col md={12}>
            <Input
              formik={formik}
              name="description"
              labelName={t("projects.description")}
              placeholder={t("projects.descriptionPlaceholder")}
              isTextArea
            />
          </Col>
          {/* <Col md={6}>
            <CustomDatePicker
              selectedDate={formik.values.startDate}
              onChange={(date) => formik.setFieldValue("startDate", date)}
              placeholderText={t("projects.startDate")}
              labelText={t("projects.startDate")}
              name="startDate"
              required
              formik={formik}
            />
          </Col>
          <Col md={6}>
            <CustomDatePicker
              selectedDate={formik.values.endDate}
              onChange={(date) => formik.setFieldValue("endDate", date)}
              placeholderText={t("projects.endDate")}
              labelText={t("projects.endDate")}
              name="endDate"
              required
              minDate={formik.values.startDate}
              formik={formik}
            />
          </Col> */}
          <Col md={6}>
            <PaginatedSelect
              labelName={t("projects.manager")}
              options={engineers.filter(
                (e) =>
                  !formik.values.engineers.some((eng) => eng.value === e.value) // Exclude selected engineers
              )}
              loadMoreOptions={(page, search) =>
                fetchOptions(
                  getEmployees,
                  page,
                  search,
                  formik.values.engineers.map((eng) => eng.value) // Pass engineers to exclude
                )
              }
              placeholder={t("projects.managerPlaceholder")}
              onChange={(value) =>
                formik.setFieldValue("projectManager", value)
              }
            />
          </Col>
          <Col md={6}>
            <PaginatedSelect
              labelName={t("projects.engineersPlaceholder")}
              options={engineers.filter(
                (e) => e.value !== formik.values.projectManager?.value // Exclude the project manager
              )}
              loadMoreOptions={(page, search) =>
                fetchOptions(
                  getEmployees,
                  page,
                  search,
                  formik.values.projectManager?.value
                    ? [formik.values.projectManager?.value]
                    : [] // Wrap in array
                )
              }
              isMulti
              placeholder={t("projects.engineersPlaceholder")}
              onChange={(value) => formik.setFieldValue("engineers", value)}
              disabled={!formik.values.projectManager} // Disable if project manager is not selected
            />
          </Col>
          <Col md={6}>
            <PaginatedSelect
              labelName={t("projects.mainContractor")}
              options={contractors}
              loadMoreOptions={(page, search) =>
                fetchOptions(getContractors, page, search)
              }
              placeholder={t("projects.contractorPlaceholder")}
              onChange={(value) => formik.setFieldValue("contractor", value)}
            />
          </Col>
          <Col md={6}>
            <PaginatedSelect
              labelName={t("projects.subContractorsPlaceholder")}
              options={contractors.filter(
                (c) => c.value !== formik.values.contractor?.value // Filter loaded options
              )}
              loadMoreOptions={(page, search) =>
                fetchOptions(
                  getContractors,
                  page,
                  search,
                  formik.values.contractor?.value
                    ? [formik.values.contractor?.value]
                    : [] // Wrap in array
                )
              }
              isMulti
              placeholder={t("projects.subContractorsPlaceholder")}
              onChange={(value) =>
                formik.setFieldValue("subContractors", value)
              }
              disabled={!formik.values.contractor} // Disable if main contractor is not selected
            />
          </Col>

          <Col md={6}>
            <PaginatedSelect
              labelName={t("projects.consultant")}
              options={consultants}
              loadMoreOptions={(page, search) =>
                fetchOptions(getConsultants, page, search)
              }
              placeholder={t("projects.consultantPlaceholder")}
              onChange={(value) => formik.setFieldValue("consultant", value)}
            />
          </Col>

          <Col sm={12} className="mb-3">
            <NewImage
              formik={formik}
              name="image"
              title={t("projects.photo")}
              uploadMsg={t("projects.uploadPhoto")}
              required
            />
          </Col>
        </Row>
      </SectionContainer>
      <div className="m-3">
        <Row className="justify-content-end g-3">
          <Col md={12} lg={3}>
            <Button
              text={t("projects.addProject")}
              type="submit"
              loading={loading}
            />
          </Col>
          <Col md={12} lg={3}>
            <Button text={t("projects.deleteProject")} styleType="outline" />
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddProject;

// import { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Row, Col } from "react-bootstrap";
// import { useTranslation } from "react-i18next";

// import {
//   getEmployees,
//   getContractors,
//   getConsultants,
//   createProject, // Import the service
// } from "../../../services";

// import Input from "../../../components/UI/Input/Input";
// import Button from "../../../components/UI/Button";
// import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// // import CustomDatePicker from "../../../components/CustomDatepicker/CustomDatepicker";
// import PaginatedSelect from "../../../components/PaginatedSelect/PaginatedSelect";
// import NewImage from "../../../components/UI/ImageInput/ImageInput";
// import { showToast } from "../../../utils"; // For notifications
// import { useNavigate } from "react-router-dom";
// import { routes } from "../../../constants";

// // Define Option and FormValues interfaces
// interface Option {
//   value: string | number;
//   label: string;
// }

// interface FormValues {
//   arabicName: string;
//   englishName: string;
//   location: string;
//   description: string;
//   startDate: Date | null;
//   endDate: Date | null;
//   projectManager: Option | null;
//   engineers: Option[];
//   contractor: Option | null;
//   subContractors: Option[];
//   consultant: Option | null;
//   image: string; // Uploaded image path
//   code: string;
// }

// const AddProject: React.FC = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   // States for options
//   const [engineers, setEngineers] = useState<Option[]>([]);
//   const [contractors, setContractors] = useState<Option[]>([]);
//   const [consultants, setConsultants] = useState<Option[]>([]);

//   // Function to fetch options
//   const fetchOptions = async (
//     service: any,
//     page: number,
//     search = ""
//   ): Promise<Option[]> => {
//     const response = await service({
//       pageNumber: page,
//       limit: 3,
//       search,
//     });

//     const data = response.data.rows;
//     return data.map((item: any) => ({
//       value: item.id,
//       label: item.name || `${item.nameEn} (${item.nameAr})`,
//     }));
//   };

//   // Load initial options
//   useEffect(() => {
//     const loadInitialOptions = async () => {
//       const [engineersOptions, contractorsOptions, consultantsOptions] =
//         await Promise.all([
//           fetchOptions(getEmployees, 1),
//           fetchOptions(getContractors, 1),
//           fetchOptions(getConsultants, 1),
//         ]);

//       setEngineers(engineersOptions);
//       setContractors(contractorsOptions);
//       setConsultants(consultantsOptions);
//     };

//     loadInitialOptions();
//   }, []);

//   // Validation schema
//   const validationSchema = Yup.object().shape({
//     arabicName: Yup.string().required(
//       t("projects.validation.arabicNameRequired")
//     ),
//     englishName: Yup.string().required(
//       t("projects.validation.englishNameRequired")
//     ),
//     location: Yup.string().required(t("projects.validation.locationRequired")),
//     description: Yup.string().required(
//       t("projects.validation.descriptionRequired")
//     ),
//     // startDate: Yup.date().required(t("projects.validation.startDateRequired")),
//     // endDate: Yup.date()
//     //   .required(t("projects.validation.endDateRequired"))
//     //   .min(Yup.ref("startDate"), t("projects.validation.endDateAfterStart")),
//     projectManager: Yup.object()
//       .nullable()
//       .required(t("projects.validation.managerRequired")),
//     engineers: Yup.array().min(1, t("projects.validation.engineersRequired")),
//     contractor: Yup.object()
//       .nullable()
//       .required(t("projects.validation.contractorRequired")),
//     subContractors: Yup.array().min(
//       1,
//       t("projects.validation.subContractorsRequired")
//     ),
//     consultant: Yup.object()
//       .nullable()
//       .required(t("projects.validation.consultantRequired")),
//     image: Yup.string().required(t("projects.validation.imageRequired")),
//   });

//   // Formik setup
//   const formik = useFormik<FormValues>({
//     initialValues: {
//       arabicName: "",
//       englishName: "",
//       location: "",
//       description: "",
//       startDate: null,
//       endDate: null,
//       projectManager: null,
//       engineers: [],
//       contractor: null,
//       subContractors: [],
//       consultant: null,
//       image: "",
//       code: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const payload = {
//           nameAr: values.arabicName,
//           nameEn: values.englishName,
//           location: values.location,
//           description: values.description,
//           // startDate: values.startDate?.toISOString(),
//           // endDate: values.endDate?.toISOString(),
//           managerId: values.projectManager?.value as string,
//           engineersIds: values.engineers.map((e) => e.value as string),
//           contractorId: values.contractor?.value as string,
//           subCotractorId: values.subContractors.map((sc) => sc.value as string),
//           consultantId: values.consultant?.value as string,
//           image: values.image,
//           code: values.code,
//         };

//         await createProject(payload);
//         showToast(t("projects.projectCreated"), "success"); // Show success toast
//         setLoading(false);
//         navigate(routes.PROJECTS);
//       } catch (error) {
//         console.error("Error creating project:", error);
//         setLoading(false);
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <SectionContainer header={t("projects.addProject")}>
//         <Row className="gy-3">
//           {/* Form fields */}
//           <Col md={6}>
//             <Input
//               formik={formik}
//               name="arabicName"
//               labelName={t("projects.arabicName")}
//               placeholder={t("projects.arabicNamePlaceholder")}
//             />
//           </Col>
//           <Col md={6}>
//             <Input
//               formik={formik}
//               name="englishName"
//               labelName={t("projects.englishName")}
//               placeholder={t("projects.englishNamePlaceholder")}
//             />
//           </Col>
//           <Col md={6}>
//             <Input
//               formik={formik}
//               name="location"
//               labelName={t("projects.location")}
//               placeholder={t("projects.locationPlaceholder")}
//             />
//           </Col>
//           <Col md={6}>
//             <Input
//               formik={formik}
//               name="code"
//               labelName={t("projects.code")}
//               placeholder={t("projects.codePlaceholder")}
//             />
//           </Col>
//           <Col md={12}>
//             <Input
//               formik={formik}
//               name="description"
//               labelName={t("projects.description")}
//               placeholder={t("projects.descriptionPlaceholder")}
//               isTextArea
//             />
//           </Col>
//           {/* <Col md={6}>
//             <CustomDatePicker
//               selectedDate={formik.values.startDate}
//               onChange={(date) => formik.setFieldValue("startDate", date)}
//               placeholderText={t("projects.startDate")}
//               labelText={t("projects.startDate")}
//               name="startDate"
//               required
//               formik={formik}
//             />
//           </Col>
//           <Col md={6}>
//             <CustomDatePicker
//               selectedDate={formik.values.endDate}
//               onChange={(date) => formik.setFieldValue("endDate", date)}
//               placeholderText={t("projects.endDate")}
//               labelText={t("projects.endDate")}
//               name="endDate"
//               required
//               minDate={formik.values.startDate}
//               formik={formik}
//             />
//           </Col> */}
//           <Col md={6}>
//             <PaginatedSelect
//               labelName={t("projects.manager")}
//               options={engineers}
//               loadMoreOptions={(page, search) =>
//                 fetchOptions(getEmployees, page, search)
//               }
//               placeholder={t("projects.managerPlaceholder")}
//               onChange={(value) =>
//                 formik.setFieldValue("projectManager", value)
//               }
//             />
//           </Col>
//           <Col md={6}>
//             <PaginatedSelect
//               labelName={t("projects.engineersPlaceholder")}
//               options={engineers.filter(
//                 (e) => e.value !== formik.values.projectManager?.value
//               )}
//               loadMoreOptions={(page, search) =>
//                 fetchOptions(getEmployees, page, search)
//               }
//               isMulti
//               placeholder={t("projects.engineersPlaceholder")}
//               onChange={(value) => formik.setFieldValue("engineers", value)}
//             />
//           </Col>
//           <Col md={6}>
//             <PaginatedSelect
//               labelName={t("projects.mainContractor")}
//               options={contractors}
//               loadMoreOptions={(page, search) =>
//                 fetchOptions(getContractors, page, search)
//               }
//               placeholder={t("projects.contractorPlaceholder")}
//               onChange={(value) => formik.setFieldValue("contractor", value)}
//             />
//           </Col>
//           <Col md={6}>
//             <PaginatedSelect
//               labelName={t("projects.subContractorsPlaceholder")}
//               options={contractors.filter(
//                 (c) => c.value !== formik.values.contractor?.value
//               )}
//               loadMoreOptions={(page, search) =>
//                 fetchOptions(getContractors, page, search)
//               }
//               isMulti
//               placeholder={t("projects.subContractorsPlaceholder")}
//               onChange={(value) =>
//                 formik.setFieldValue("subContractors", value)
//               }
//             />
//           </Col>
//           <Col md={6}>
//             <PaginatedSelect
//               labelName={t("projects.consultant")}
//               options={consultants}
//               loadMoreOptions={(page, search) =>
//                 fetchOptions(getConsultants, page, search)
//               }
//               placeholder={t("projects.consultantPlaceholder")}
//               onChange={(value) => formik.setFieldValue("consultant", value)}
//             />
//           </Col>

//           <Col sm={12} className="mb-3">
//             <NewImage
//               formik={formik}
//               name="image"
//               title={t("projects.photo")}
//               uploadMsg={t("projects.uploadPhoto")}
//               required
//             />
//           </Col>
//         </Row>
//       </SectionContainer>
//       <div className="m-3">
//         <Row className="justify-content-end g-3">
//           <Col md={12} lg={3}>
//             <Button
//               text={t("projects.addProject")}
//               type="submit"
//               loading={loading}
//             />
//           </Col>
//           <Col md={12} lg={3}>
//             <Button text={t("projects.deleteProject")} styleType="outline" />
//           </Col>
//         </Row>
//       </div>
//     </form>
//   );
// };

// export default AddProject;
