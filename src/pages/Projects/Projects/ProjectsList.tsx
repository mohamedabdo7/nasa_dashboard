import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import ActionsMenu from "../../../components/UI/ActionsMenu/ActionsMenu";
import { routes } from "../../../constants";
import SearchInput from "../../../components/UI/SearchInput/SearchInput";
import Button from "../../../components/UI/Button";
import TableComponent from "../../../components/Table/TableComponent";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import { FaExclamationCircle } from "react-icons/fa";
import { i18n, showToast } from "../../../utils";
import { deleteProject } from "../../../services";
import { truncateString } from "../../../utils/truncateString";

const ProjectsList: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State management
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [listiner, setListiner] = useState(false);

  // Fetching data
  const url = "getProjects"; // API endpoint for projects
  const { data, loading, count, setPageNumber, pageNumber } = useFetchTableData(
    searchValue,
    url,
    { search: searchValue },
    listiner
  );

  const memoizedData = useMemo(() => data, [data]);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    setDeleteLoading(true);
    try {
      // Call the API service to delete the project
      await deleteProject(selectedProject.id);

      // Trigger re-fetching of table data after successful deletion
      setListiner(!listiner);

      // Close the modal after deletion
      handleModalClose();

      // Show success message
      showToast(t("projects.projectDeleted"), "success");
    } catch (error) {
      console.error("Failed to delete project:", error);

      // Show error message if the deletion fails
      showToast(t("projects.deleteFailed"), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Table columns definition
  const columns = [
    {
      Header: t("projects.projectId"),
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {truncateString(row.original.id, i18n.language !== "en", 10)}
          </span>
        </div>
      ),
    },
    {
      Header: t("projects.projectName"),
      accessor: i18n.language === "en" ? "nameEn" : "nameAr",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {i18n.language === "en"
              ? truncateString(row.original.nameEn, i18n.language !== "en", 20)
              : truncateString(row.original.nameAr, i18n.language !== "en", 20)}
          </span>
        </div>
      ),
    },
    {
      Header: t("projects.manager"),
      accessor: "manager.name",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {truncateString(
              row?.original?.manager?.name,
              i18n.language !== "en",
              20
            )}
          </span>
        </div>
      ),
    },
    {
      Header: t("projects.mainContractor"),
      accessor: "mainContractor.nameEn",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {i18n.language === "en"
              ? truncateString(
                  row.original?.mainContractor?.nameEn,
                  i18n.language !== "en",
                  20
                )
              : truncateString(
                  row.original?.mainContractor?.nameAr,
                  i18n.language !== "en",
                  20
                )}
          </span>
        </div>
      ),
    },
    {
      Header: t("projects.consultant"),
      accessor: "consultant.name",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div className="d-flex">
          <span className="ms-2">
            {truncateString(
              row?.original?.consultant?.name,
              i18n.language !== "en",
              20
            )}
          </span>
        </div>
      ),
    },
    {
      Header: "",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <ActionsMenu
          onEdit={() =>
            navigate(
              routes.EDITPROJECT.replace(":id", row.original.id.toString())
            )
          }
          onView={() =>
            navigate(
              routes.VIEWPROJECT.replace(":id", row.original.id.toString())
            )
          }
          onDelete={() => {
            setSelectedProject(row.original);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Container fluid>
      <Stack direction="vertical">
        {/* Search and Add Project Row */}
        <Row>
          <Col lg={10} md={12}>
            <SearchInput
              value={searchValue}
              type="text"
              leftIcon={<GoSearch />}
              inputMode="search"
              onChange={(e: any) => setSearchValue(e.target.value)}
              placeholder={t("projects.search")}
            />
          </Col>

          <Col md={12} lg={2}>
            <Button
              onClick={() => navigate(routes.ADDPROJECT)}
              text={t("projects.addProject")}
              type="button"
              style={{ height: "49.6px", fontSize: "14px", margin: "1rem 0" }}
            />
          </Col>
        </Row>

        {/* Loading Spinner or Table */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" />
          </div>
        ) : (
          <TableComponent
            columns={columns}
            data={memoizedData || []}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageCount={Math.ceil(count / 10)}
            enableSorting={true}
          />
        )}
      </Stack>

      {/* Delete Project Modal */}
      {isModalOpen && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleDeleteProject}
          modalTitle={t("projects.deleteProject")}
          modalMessage={`${t("projects.deleteMsg")} “${
            i18n.language === "en"
              ? selectedProject?.nameEn
              : selectedProject?.nameAr
          }“?`}
          confirmBtnText={t("buttons.delete")}
          cancelBtnText={t("buttons.cancel")}
          loading={deleteLoading}
          Icon={<FaExclamationCircle color="#dc3545" size={20} />}
        />
      )}
    </Container>
  );
};

export default ProjectsList;
