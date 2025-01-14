import { FC, useState } from "react";
import SectionContainer from "../../../components/SectionContainer/SectionContainer";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import { Col, Row } from "react-bootstrap";
import Input from "../../../components/UI/Input/Input";
import { useTranslation } from "react-i18next";
import Button from "../../../components/UI/Button";
import { createService } from "../../../services"; // Import the createService function
import { showToast } from "../../../utils"; // Utility for showing toast messages
import { routes } from "../../../constants";
import { useNavigate } from "react-router-dom";
import EasyAccess from "../../../components/UI/Breadcrumb/EasyAccess";

const AddService: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State to manage form inputs
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [icon, setIcon] = useState<string>(""); // The icon will store the URL of the uploaded image
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { text: t("services.ourServices"), link: routes.SERVICES },
    { text: t("services.addNewService") },
  ];

  // Handle image upload and set the icon URL
  const handleImageChange = (imageUrl: string | null) => {
    // Process the imageUrl here, it can be either a string (URL) or null
    console.log("Image URL changed:", imageUrl);
    if (imageUrl) {
      // You can remove the domain part here, as before
      const baseUrl = import.meta.env.VITE_NASA_URL;
      const iconUrl = imageUrl.replace(baseUrl, "");
      // Now you have the relative path of the icon
      console.log("Icon URL without domain:", iconUrl);
      setIcon(iconUrl);
    } else {
      console.log("No image selected or image deleted.");
    }
  };
  // Handle service creation
  const handleSubmit = async () => {
    if (!title || !body || !icon) {
      showToast("All fields are required", "error");
      return;
    }

    setLoading(true);

    try {
      // Remove the domain from the icon URL if present
      const baseUrl = import.meta.env.VITE_NASA_URL;
      const iconUrl = icon.replace(baseUrl, "");

      // Create JSON payload with title, body, and the modified icon URL
      const payload = {
        title,
        body,
        icon: iconUrl, // Now the icon contains only the relative path
      };

      await createService(payload); // Send the JSON payload
      showToast("Service created successfully", "success");
      navigate(routes.SERVICES);
      // Reset the form or redirect as necessary
    } catch (error) {
      console.error("Error creating service:", error);
      showToast("Error creating service", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100">
      <EasyAccess items={breadcrumbItems} />
      <SectionContainer header="Service information">
        <ImageUpload name="icon" onImageChange={handleImageChange} />
        <Row>
          <Col lg={12}>
            <Input
              type="text"
              name="title"
              labelName={t("inputs.title")}
              placeholder={t("placeholder.enterTitle")}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
          <Col lg={12}>
            <Input
              type="text"
              name="body"
              labelName={t("inputs.body")}
              placeholder={t("placeholder.enterBody")}
              required
              isTextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Col>
        </Row>
      </SectionContainer>

      <Row className="d-flex justify-content-end gy-2">
        <Col lg={3}>
          <Button
            text={t("buttons.add")}
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !title || !body || !icon}
          />
        </Col>
        <Col lg={3}>
          <Button text={t("buttons.cancel")} styleType="outline" />
        </Col>
      </Row>
    </div>
  );
};

export default AddService;
