import React, { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Input from "../../components/UI/Input/Input";
import InputPassword from "../../components/UI/Input/InputPassword";
import Button from "../../components/UI/Button";
import * as Yup from "yup";
import { getOneConsultant, updateConsultant } from "../../services";
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import { useNavigate, useParams } from "react-router-dom";
import { CreateConsultantPayload } from "../../types/Employee";

const EditConsultant: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [fetchLoading, setFetchLoading] = useState(false); // Loading for fetching data
  const [submitLoading, setSubmitLoading] = useState(false); // Loading for submitting the form
  const [consultantData, setConsultantData] = useState<any>(null);

  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        setFetchLoading(true);
        const response = await getOneConsultant(id!);
        setConsultantData(response.data);
      } catch (error) {
        console.error("Error fetching consultant:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchConsultant();
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, t("validation.nameMin"))
      .max(30, t("validation.nameMax"))
      .required(t("validation.nameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    // password: Yup.string()
    //   .notRequired()
    //   .min(8, t("validation.passwordMinLength", { min: 8 }))
    //   .matches(/[a-z]/, t("validation.lowercaseRequired"))
    //   .matches(/[A-Z]/, t("validation.uppercaseRequired"))
    //   .matches(/[^a-zA-Z0-9]/, t("validation.specialCharRequired")),
    // confirmPassword: Yup.string().when("password", {
    //   is: (password: string) => !!password,
    //   then: Yup.string()
    //     .required(t("validation.confirmPasswordRequired"))
    //     .oneOf([Yup.ref("password")], t("validation.passwordsMatch")),
    // }),
  });

  const formik = useFormik({
    initialValues: {
      name: consultantData?.name || "",
      email: consultantData?.email || "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      updateConsultantHandler(values);
    },
  });

  const updateConsultantHandler = async (payload: CreateConsultantPayload) => {
    setSubmitLoading(true);
    try {
      await updateConsultant(id!, payload); // Send all fields, including password and confirmPassword
      showToast(t("consultants.consultantUpdated"), "success");
      navigate(routes.CONSULTANTS);
    } catch (error) {
      console.error("Error updating consultant:", error);
      setSubmitLoading(false);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    navigate(routes.CONSULTANTS);
  };

  const breadcrumbItems = [
    {
      text: t("consultants.consultants"),
      link: routes.CONSULTANTS,
    },
    { text: t("consultants.editConsultant") },
  ];

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />

      {fetchLoading ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <SectionContainer header={t("consultants.consultantInfo")}>
            <Row className="gy-3">
              <Col md={12} lg={6}>
                <Input
                  required
                  formik={formik}
                  labelName={t("inputs.name")}
                  name="name"
                  type="text"
                  value={formik.values.name}
                  placeholder={t("placeholder.name")}
                />
              </Col>

              <Col md={12} lg={6}>
                <Input
                  required
                  formik={formik}
                  labelName={t("inputs.email")}
                  name="email"
                  type="text"
                  value={formik.values.email}
                  placeholder={t("placeholder.email")}
                />
              </Col>

              <Col lg={6} md={12}>
                <InputPassword
                  formik={formik}
                  name="password"
                  labelName={t("inputs.password")}
                  placeholder={t("placeholder.enterPassword")}
                />
              </Col>

              <Col lg={6} md={12}>
                <InputPassword
                  formik={formik}
                  name="confirmPassword"
                  labelName={t("inputs.confirmPassword")}
                  placeholder={t("placeholder.confirmPassword")}
                />
              </Col>
            </Row>
          </SectionContainer>
          <div className="m-3">
            <Row className="justify-content-end g-3">
              <Col md={12} lg={3}>
                <Button
                  text={t("buttons.update")}
                  type="submit"
                  loading={submitLoading} // Submit loading
                />
              </Col>
              <Col md={12} lg={3}>
                <Button
                  onClick={handleCancel}
                  text={t("actions.cancel")}
                  styleType="outline"
                />
              </Col>
            </Row>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditConsultant;
