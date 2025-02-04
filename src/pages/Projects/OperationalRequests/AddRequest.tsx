import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
// import * as Yup from "yup";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
// import PaginatedSelect from "../../../components/PaginatedSelect/PaginatedSelect";
import SingleSelect from "../../../components/UI/Multi-Select/SingleSelect";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
// import NewImage from "../../../components/UI/ImageInput/ImageInput";
import {
  createOperationalRequest,
  createOperationalRequestCons,
  createOperationalRequestEmp,
  getProjects,
  getProjectsForConsultant,
  getProjectsForEmp,
} from "../../../services";
import { showToast } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../constants";
import MultiImageUpload from "../../../components/UI/MultiImageUpload/MultiImageUpload";
import { useAuth } from "../../../context/AuthContext";

interface Option {
  value: string | number;
  label: string;
}

interface FormValues {
  projectId: string;
  requestType: string;
  description: string;
  images: string[]; // Array of uploaded image paths
  type: string;
}

const AddRequest: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response;
        if (user.type === "Employee") {
          response = await getProjectsForEmp({ pageNumber: 1, limit: 10 });
        } else if (user.type === "Consultant") {
          response = await getProjectsForConsultant({
            pageNumber: 1,
            limit: 10,
          });
        } else {
          response = await getProjects({ pageNumber: 1, limit: 10 });
        }

        if (response) {
          const options = response.data.rows.map((project: any) => ({
            value: project.id,
            label: project.nameEn || project.nameAr,
          }));
          setProjects(options);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, [user.type]);

  // Validation schema
  // const validationSchema = Yup.object().shape({
  //   projectId: Yup.string().required(t("requests.validation.projectRequired")),
  //   requestType: Yup.string().required(
  //     t("requests.validation.requestTypeRequired")
  //   ),
  //   description: Yup.string().required(
  //     t("requests.validation.descriptionRequired")
  //   ),
  //   images: Yup.array()
  //     .of(Yup.string())
  //     .max(5, t("requests.validation.maxImages")),
  //   type: Yup.string().required(t("requests.validation.typeRequired")),
  // });

  // Formik setup
  const formik = useFormik<FormValues>({
    initialValues: {
      projectId: "",
      requestType: "",
      description: "",
      images: [],
      type: "",
    },
    // validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          //   projectId: values.projectId?.value,
          projectId: values.projectId,
          requestType: values.requestType,
          description: values.description,
          images: values.images,
          type: values.type,
        };
        if (user.type === "Employee") {
          await createOperationalRequestEmp(payload);
        } else if (user.type === "Consultant") {
          await createOperationalRequestCons(payload);
        } else {
          await createOperationalRequest(payload);
        }
        showToast(t("requests.requestCreated"), "success");
        navigate(routes.OPERATIONALREQUESTS);
      } catch (error) {
        console.error("Error creating request:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-100">
      <form onSubmit={formik.handleSubmit}>
        <SectionContainer header={t("requests.addRequest")}>
          <Row className="gy-3">
            {/* Project Selection */}
            <Col md={4}>
              <SingleSelect
                required
                options={projects}
                placeholder={t("requests.selectProject")}
                formik={formik}
                name="projectId"
                labelName={t("requests.project")}
                onChange={(option) => formik.setFieldValue("projectId", option)}
              />
            </Col>

            {/* Request Type */}
            <Col md={4}>
              <SingleSelect
                required
                options={[
                  { value: "WIR", label: "WIR" },
                  { value: "DSR", label: "DSR" },
                  { value: "MSR", label: "MSR" },
                ]}
                placeholder={t("requests.requestTypePlaceholder")}
                formik={formik}
                name="requestType"
                labelName={t("requests.requestType")}
                onChange={(option) =>
                  formik.setFieldValue("requestType", option.value)
                }
              />
            </Col>

            {/* Type */}
            <Col md={4}>
              <SingleSelect
                required
                options={[
                  { value: "STR", label: "Structural" },
                  { value: "ARCH", label: "Architectural" },
                  { value: "MECH", label: "Mechanical" },
                  { value: "ELECT", label: "Electrical" },
                  { value: "FINISH", label: "Finishing" },
                ]}
                placeholder={t("requests.typePlaceholder")}
                formik={formik}
                name="type"
                labelName={t("requests.type")}
                onChange={(option) =>
                  formik.setFieldValue("type", option.value)
                }
              />
            </Col>

            {/* Description */}
            <Col md={12}>
              <Input
                formik={formik}
                name="description"
                labelName={t("requests.description")}
                placeholder={t("requests.descriptionPlaceholder")}
                required
                rows={5}
                isTextArea
              />
            </Col>

            {/* Images Upload */}
            <Col md={12}>
              <MultiImageUpload
                name="images"
                formik={formik}
                isEdit={false}
                required
              />
            </Col>
          </Row>
        </SectionContainer>
        <div className="m-3">
          <Row className="justify-content-end g-3">
            <Col md={12} lg={3}>
              <Button
                text={t("requests.addRequest")}
                type="submit"
                loading={loading}
              />
            </Col>
            <Col md={12} lg={3}>
              <Button
                text={t("buttons.cancel")}
                type="button"
                styleType="outline"
                onClick={() => navigate(routes.OPERATIONALREQUESTS)}
              />
            </Col>
          </Row>
        </div>
      </form>
    </div>
  );
};

export default AddRequest;
