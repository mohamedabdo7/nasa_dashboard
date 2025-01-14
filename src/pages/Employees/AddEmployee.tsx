import React, { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row } from "react-bootstrap";
import SingleSelect from "../../components/UI/Multi-Select/SingleSelect";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Input from "../../components/UI/Input/Input";
import InputPassword from "../../components/UI/Input/InputPassword";
import Button from "../../components/UI/Button";
import * as Yup from "yup";
import { createEmployee, getDepartments, getRoles } from "../../services";
import { generateRandomPassword } from "../../utils/generatePassword";
import { CreateEmployeePayload } from "../../types/Employee";
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import { useNavigate } from "react-router-dom";

const AddEmployee: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [engType, setEngType] = useState<any>(null);
  // const [image, setImage] = useState<File | null>(null); // State for image upload

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsResponse, rolesResponse] = await Promise.all([
          getDepartments(),
          getRoles(),
        ]);

        if (departmentsResponse?.data?.rows) {
          const departmentOptions = departmentsResponse.data.rows.map(
            (dept: any) => ({
              label: dept.nameEn,
              value: dept.id,
            })
          );
          setDepartments(departmentOptions);
        }

        if (rolesResponse?.data?.rows) {
          const roleOptions = rolesResponse.data.rows.map((role: any) => ({
            label: role.nameEn,
            value: role.id,
          }));
          setRoles(roleOptions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, t("validation.nameMin"))
      .max(30, t("validation.nameMax"))
      .required(t("validation.nameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    type: Yup.string().required(t("validation.typeRequired")),
    engType: Yup.string().when("type", (type: any, schema) => {
      return type === "1f26a340-1fb7-48e8-a34b-3c2acc60676f"
        ? schema.required(t("validation.engTypeRequired"))
        : schema.notRequired();
    }),
    // password: Yup.string()
    //   .required(t("validation.passwordRequired"))
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //     t("validation.passwordInvalid")
    //   ),
    // confirmPassword: Yup.string()
    //   .required(t("validation.confirmPasswordRequired"))
    //   .oneOf([Yup.ref("password"), null], t("validation.passwordMismatch")),
    password: Yup.string()
      .required(t("validation.passwordRequired"))
      .min(8, t("validation.passwordMinLength", { min: 8 }))
      .matches(/[a-z]/, t("validation.lowercaseRequired"))
      .matches(/[A-Z]/, t("validation.uppercaseRequired"))
      .matches(/[^a-zA-Z0-9]/, t("validation.specialCharRequired")),
    confirmPassword: Yup.string()
      .required(t("validation.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("validation.passwordsMatch")),
    roleId: Yup.string().required(t("validation.roleRequired")),
    // image: Yup.mixed().required(t("validation.imageRequired")),
  });

  // const validationSchema2 = Yup.object().shape({
  //   name: Yup.string()
  //     .min(4, t("validation.nameMin"))
  //     .max(30, t("validation.nameMax"))
  //     .required(t("validation.nameRequired")),
  //   email: Yup.string()
  //     .email(t("validation.emailInvalid"))
  //     .required(t("validation.emailRequired")),
  //   type: Yup.string().required(t("validation.typeRequired")),
  //   password: Yup.string()
  //     .required(t("validation.passwordRequired"))
  //     .matches(
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //       t("validation.passwordInvalid")
  //     ),
  //   confirmPassword: Yup.string()
  //     .required(t("validation.confirmPasswordRequired"))
  //     .oneOf([Yup.ref("password"), null], t("validation.passwordMismatch")),
  //   // roleId: Yup.string().required(t("validation.roleRequired")),
  //   // image: Yup.mixed().required(t("validation.imageRequired")),
  // });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      type: "",
      password: "",
      confirmPassword: "",
      roleId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = {
        ...values,
        image: "/uploads/111.png", // Include image file
      };
      delete (formData as { type?: unknown }).type;
      addEmpHandler(formData);
    },
  });

  console.log("selectedType", formik.errors);

  const addEmpHandler = async (payload: CreateEmployeePayload) => {
    setLoading(true);
    try {
      // Create a shallow copy to avoid mutating the original payload
      const cleanedPayload: Partial<CreateEmployeePayload> = { ...payload };

      // Remove keys with empty string or null values
      (Object.keys(cleanedPayload) as (keyof CreateEmployeePayload)[]).forEach(
        (key) => {
          if (cleanedPayload[key] === "" || cleanedPayload[key] === null) {
            delete cleanedPayload[key];
          }
        }
      );
      await createEmployee(cleanedPayload as CreateEmployeePayload);
      showToast(t("employees.empCreated"), "success");
      navigate(routes.EMPLOYEES);
    } catch (error) {
      console.error("Error creating employee:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    // setImage(null);
    // Navigate to employee list (replace with your navigation logic)
    console.log("Redirect to employee list");
    navigate(routes.EMPLOYEES);
  };

  const breadcrumbItems = [
    {
      text: t("employees.employees"),
      link: routes.EMPLOYEES,
    },
    { text: t("employees.addEmployee") },
  ];

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />

      <form onSubmit={formik.handleSubmit}>
        <SectionContainer header={t("employees.employeeInfo")}>
          <Row className="gy-3">
            <Col md={12} lg={12}>
              <SingleSelect
                required
                options={departments}
                placeholder={t("employees.empTypePlaceholder")}
                formik={formik}
                name="type"
                labelName={t("employees.empType")}
                value={selectedType}
                onChange={(option) => {
                  setSelectedType(option);
                  // formik.setFieldValue("type", option.value);
                }}
              />
            </Col>

            {selectedType?.label === "Engeneering" && (
              <Col md={12} lg={12}>
                <SingleSelect
                  required
                  options={roles}
                  placeholder={t("employees.engTypePlaceholder")}
                  formik={formik}
                  name="roleId"
                  labelName={t("employees.engType")}
                  value={engType}
                  onChange={(option) => {
                    formik.setFieldValue("roleId", option.value);
                    setEngType(option);
                  }}
                />
              </Col>
            )}

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
              <Button
                text={t("buttons.add")}
                // onClick={() => formik.handleSubmit()}
                type="submit"
                loading={loading}
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
    </div>
  );
};

export default AddEmployee;
