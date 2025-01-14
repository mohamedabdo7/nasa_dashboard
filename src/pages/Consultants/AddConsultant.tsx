import React, { useState } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Input from "../../components/UI/Input/Input";
import InputPassword from "../../components/UI/Input/InputPassword";
import Button from "../../components/UI/Button";
import * as Yup from "yup";
import { createConsultant } from "../../services";
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import { useNavigate } from "react-router-dom";
import { generateRandomPassword } from "../../utils/generatePassword";
import { CreateConsultantPayload } from "../../types/Employee";

const AddConsultant: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, t("validation.nameMin"))
      .max(30, t("validation.nameMax"))
      .required(t("validation.nameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    password: Yup.string()
      .required(t("validation.passwordRequired"))
      .min(8, t("validation.passwordMinLength", { min: 8 }))
      .matches(/[a-z]/, t("validation.lowercaseRequired"))
      .matches(/[A-Z]/, t("validation.uppercaseRequired"))
      .matches(/[^a-zA-Z0-9]/, t("validation.specialCharRequired")),
    confirmPassword: Yup.string()
      .required(t("validation.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("validation.passwordsMatch")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      addConsultantHandler(values);
    },
  });

  const addConsultantHandler = async (payload: CreateConsultantPayload) => {
    setLoading(true);
    try {
      await createConsultant(payload); // Send both `password` and `confirmPassword`
      showToast(t("consultants.consultantCreated"), "success");
      navigate(routes.CONSULTANTS);
    } catch (error) {
      console.error("Error creating consultant:", error);
      setLoading(false);
    } finally {
      setLoading(false);
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
    { text: t("consultants.addConsultant") },
  ];

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />

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

            <Col lg={4} md={12}>
              <InputPassword
                formik={formik}
                name="password"
                labelName={t("inputs.password")}
                required
                placeholder={t("placeholder.enterPassword")}
              />
            </Col>

            <Col lg={4} md={12}>
              <InputPassword
                formik={formik}
                name="confirmPassword"
                labelName={t("inputs.confirmPassword")}
                required
                placeholder={t("placeholder.confirmPassword")}
              />
            </Col>

            <Col lg={4} md={12}>
              <Button
                text={t("buttons.generatePassword")}
                onClick={() => {
                  const newPassword = generateRandomPassword();
                  formik.setFieldValue("password", newPassword);
                  formik.setFieldValue("confirmPassword", newPassword);
                }}
                style={{ marginTop: "0.5rem" }}
              />
            </Col>
          </Row>
        </SectionContainer>
        <div className="m-3">
          <Row className="justify-content-end g-3">
            <Col md={12} lg={3}>
              <Button text={t("buttons.add")} type="submit" loading={loading} />
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
    </div>
  );
};

export default AddConsultant;
