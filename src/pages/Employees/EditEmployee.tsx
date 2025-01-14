import React, { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row, Spinner } from "react-bootstrap";
import SingleSelect from "../../components/UI/Multi-Select/SingleSelect";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Input from "../../components/UI/Input/Input";
import InputPassword from "../../components/UI/Input/InputPassword";
import Button from "../../components/UI/Button";
import * as Yup from "yup";
import {
  updateEmployee,
  getOneEmployee,
  getDepartments,
  getRoles,
} from "../../services";
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import { useNavigate, useParams } from "react-router-dom";
import { CreateEmployeePayload } from "../../types/Employee";
import { generateRandomPassword } from "../../utils/generatePassword";

const EditEmployee: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); // Track data fetching
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<any>(null);

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

        if (id) {
          const employeeResponse = await getOneEmployee(id);
          setEmployeeData(employeeResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false); // Data fetching is complete
      }
    };

    fetchData();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, t("validation.nameMin"))
      .max(30, t("validation.nameMax"))
      .required(t("validation.nameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .required(t("validation.emailRequired")),
    type: Yup.string().required(t("validation.typeRequired")),
    roleId: Yup.string().required(t("validation.roleRequired")),
    engType: Yup.string().required(t("validation.engTypeRequired")), // Validation for engType
  });

  const formik = useFormik({
    initialValues: {
      name: employeeData?.name || "",
      email: employeeData?.email || "",
      type: employeeData?.role?.department?.id || "",
      roleId: employeeData?.roleId || "",
      engType: employeeData?.role?.id || "", // Store role ID for engType
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = { ...values };
      updateEmpHandler(formData);
    },
  });

  const updateEmpHandler = async (payload: CreateEmployeePayload) => {
    setLoading(true);
    try {
      const cleanedPayload: Partial<CreateEmployeePayload> = { ...payload };

      // Remove keys with empty string or null values
      (Object.keys(cleanedPayload) as (keyof CreateEmployeePayload)[]).forEach(
        (key) => {
          if (cleanedPayload[key] === "" || cleanedPayload[key] === null) {
            delete cleanedPayload[key];
          }
        }
      );
      delete (cleanedPayload as { type?: unknown }).type;
      delete (cleanedPayload as { roleId?: unknown }).roleId;
      delete (cleanedPayload as { engType?: unknown }).engType;
      await updateEmployee(id!, cleanedPayload as CreateEmployeePayload);
      showToast(t("employees.empUpdated"), "success");
      navigate(routes.EMPLOYEES);
    } catch (error) {
      console.error("Error updating employee:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    navigate(routes.EMPLOYEES);
  };

  const breadcrumbItems = [
    {
      text: t("employees.employees"),
      link: routes.EMPLOYEES,
    },
    { text: t("employees.editEmployee") },
  ];

  if (loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 vh-70">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />

      <form onSubmit={formik.handleSubmit}>
        <SectionContainer header={t("employees.employeeInfo")}>
          <Row className="gy-3">
            {/* Employee Type (Department) */}
            <Col md={12} lg={12}>
              <SingleSelect
                readOnly
                required
                options={departments}
                placeholder={t("employees.empTypePlaceholder")}
                formik={formik}
                name="type"
                labelName={t("employees.empType")}
                value={
                  departments.find(
                    (dept) => dept.value === formik.values.type
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("type", option.value)
                }
              />
            </Col>

            {/* Engineer Type */}
            <Col md={12} lg={12}>
              <SingleSelect
                readOnly
                required
                options={roles} // Engineer types populated as roles
                placeholder={t("employees.engTypePlaceholder")}
                formik={formik}
                name="engType"
                labelName={t("employees.engType")}
                value={
                  roles.find((role) => role.value === formik.values.engType) ||
                  null
                }
                onChange={(option) =>
                  formik.setFieldValue("engType", option.value)
                }
              />
            </Col>

            {/* Name Field */}
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

            {/* Email Field */}
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

            {/* Password Field */}
            <Col lg={4} md={12}>
              <InputPassword
                formik={formik}
                name="password"
                labelName={t("inputs.password")}
                placeholder={t("placeholder.enterPassword")}
              />
            </Col>

            {/* Confirm Password Field */}
            <Col lg={4} md={12}>
              <InputPassword
                formik={formik}
                name="confirmPassword"
                labelName={t("inputs.confirmPassword")}
                placeholder={t("placeholder.confirmPassword")}
              />
            </Col>

            {/* Generate Password Button */}
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
                text={t("buttons.update")}
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

export default EditEmployee;
