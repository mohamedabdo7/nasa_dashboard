import React, { useState } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Input from "../../components/UI/Input/Input";
// import InputPassword from "../../components/UI/Input/InputPassword";
// import { generateRandomPassword } from "../../utils/generatePassword";
import Button from "../../components/UI/Button";
import * as Yup from "yup";
import { createContractor } from "../../services";
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import { useNavigate } from "react-router-dom";
import { CreateContractorPayload } from "../../types/Employee";

const AddContractor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    nameEn: Yup.string()
      .min(4, t("validation.nameMin"))
      .max(30, t("validation.nameMax"))
      .required(t("validation.nameRequired")),
    nameAr: Yup.string()
      .min(4, t("validation.nameMin"))
      .max(30, t("validation.nameMax"))
      .required(t("validation.nameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    // password: Yup.string()
    //   .required(t("validation.passwordRequired"))
    //   .min(8, t("validation.passwordMinLength", { min: 8 }))
    //   .matches(/[a-z]/, t("validation.lowercaseRequired"))
    //   .matches(/[A-Z]/, t("validation.uppercaseRequired"))
    //   .matches(/[^a-zA-Z0-9]/, t("validation.specialCharRequired")),
    // confirmPassword: Yup.string()
    //   .required(t("validation.confirmPasswordRequired"))
    //   .oneOf([Yup.ref("password")], t("validation.passwordsMatch")),
  });

  const formik = useFormik({
    initialValues: {
      nameEn: "",
      nameAr: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = { ...values, image: "/uploads/111.png" };
      addContractorHandler(formData);
    },
  });

  const addContractorHandler = async (payload: CreateContractorPayload) => {
    setLoading(true);
    try {
      delete payload.confirmPassword;
      delete payload.password;
      await createContractor(payload);
      showToast(t("contractors.contractorCreated"), "success");
      navigate(routes.CONTRACTORS);
    } catch (error) {
      console.error("Error creating contractor:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    navigate(routes.CONTRACTORS);
  };

  const breadcrumbItems = [
    {
      text: t("contractors.contractors"),
      link: routes.CONTRACTORS,
    },
    { text: t("contractors.addContractor") },
  ];

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />

      <form onSubmit={formik.handleSubmit}>
        <SectionContainer header={t("contractors.contractorInfo")}>
          <Row className="gy-3">
            <Col md={12} lg={6}>
              <Input
                required
                formik={formik}
                labelName={t("inputs.nameEn")}
                name="nameEn"
                type="text"
                value={formik.values.nameEn}
                placeholder={t("placeholder.nameEn")}
              />
            </Col>

            <Col md={12} lg={6}>
              <Input
                required
                formik={formik}
                labelName={t("inputs.nameAr")}
                name="nameAr"
                type="text"
                value={formik.values.nameAr}
                placeholder={t("placeholder.nameAr")}
              />
            </Col>

            <Col md={12} lg={12}>
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

            {/* <Col lg={4} md={12}>
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
            </Col> */}
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

export default AddContractor;
