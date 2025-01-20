import React, { useEffect, useState } from "react";
import SectionContainer from "../../components/SectionContainer/SectionContainer";
import { Col, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button";
import * as Yup from "yup";
import { getOneContractor, updateContractor } from "../../services";
import { showToast } from "../../utils";
import { routes } from "../../constants";
import EasyAccess from "../../components/UI/Breadcrumb/EasyAccess";
import { useNavigate, useParams } from "react-router-dom";
import { CreateContractorPayload } from "../../types/Employee";
import NewImage from "../../components/UI/ImageInput/UpdateImageInput";

const EditContractor: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [fetchLoading, setFetchLoading] = useState(false); // Loading for fetching data
  const [submitLoading, setSubmitLoading] = useState(false); // Loading for submitting the form
  const [contractorData, setContractorData] = useState<any>(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        setFetchLoading(true);
        const response = await getOneContractor(id!);
        setContractorData(response.data);
      } catch (error) {
        console.error("Error fetching contractor:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchContractor();
    }
  }, [id]);

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
  });

  const formik = useFormik({
    initialValues: {
      image: contractorData?.image || "",
      nameEn: contractorData?.nameEn || "",
      nameAr: contractorData?.nameAr || "",
      email: contractorData?.email || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData: CreateContractorPayload = { ...values };
      updateContractorHandler(formData);
    },
  });

  const updateContractorHandler = async (payload: CreateContractorPayload) => {
    setSubmitLoading(true);
    try {
      await updateContractor(id!, payload);
      showToast(t("contractors.contractorUpdated"), "success");
      navigate(routes.CONTRACTORS);
    } catch (error) {
      console.error("Error updating contractor:", error);
      setSubmitLoading(false);
    } finally {
      setSubmitLoading(false);
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
    { text: t("contractors.editContractor") },
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
          <SectionContainer header={t("contractors.contractorInfo")}>
            <Row className="gy-3">
              <Col sm={12} className="mb-3">
                <NewImage formik={formik} name="image" />
              </Col>
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

export default EditContractor;
