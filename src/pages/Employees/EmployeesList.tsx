import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { useFetchTableData } from "../../hooks/useFetchTableData";
import ActionsMenu from "../../components/UI/ActionsMenu/ActionsMenu";
import { routes } from "../../constants";
import SearchInput from "../../components/UI/SearchInput/SearchInput";
import Button from "../../components/UI/Button";
import TableComponent from "../../components/Table/TableComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { FaExclamationCircle } from "react-icons/fa";
import { deleteEmployee } from "../../services";
import { showToast } from "../../utils";

const EmployessList: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State management
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [listiner, setListiner] = useState(false);

  // Fetching data
  const url = "getEmployees";
  const { data, loading, count, setPageNumber, pageNumber } = useFetchTableData(
    searchValue,
    url,
    { search: searchValue },
    listiner
  );

  const memoizedData = useMemo(() => data, [data]);

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    setDeleteLoading(true);
    try {
      // Call the API service to delete the employee
      await deleteEmployee(selectedEmployee.id);

      // Trigger re-fetching of table data after successful deletion
      setListiner(!listiner);

      // Close the modal after deletion
      handleModalClose();

      // Show success message
      showToast(t("employees.empDeleted"), "success");
    } catch (error) {
      console.error("Failed to delete employee:", error);

      // Show error message if the deletion fails
      showToast(t("employees.deleteFailed"), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Table columns definition
  const columns = [
    {
      Header: `${t("inputs.name")}`,
      accessor: "name",
      disableSortBy: true,
    },
    {
      Header: t("inputs.email"),
      accessor: "email",
      disableSortBy: true,
    },
    {
      Header: "",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <ActionsMenu
          onEdit={() =>
            navigate(
              routes.EDITEMPLOYEE.replace(":id", row.original.id.toString())
            )
          }
          onView={() =>
            navigate(
              routes.VIEWEMPLOYEE.replace(":id", row.original.id.toString())
            )
          }
          onDelete={() => {
            setSelectedEmployee(row.original);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Container fluid>
      <Stack direction="vertical">
        {/* Search and Add Service Row */}
        <Row>
          <Col lg={10} md={12}>
            <SearchInput
              value={searchValue}
              type="text"
              leftIcon={<GoSearch />}
              inputMode="search"
              onChange={(e: any) => setSearchValue(e.target.value)}
              placeholder={t("employees.search")}
            />
          </Col>

          <Col md={12} lg={2}>
            <Button
              onClick={() => navigate(routes.ADDEMPLOYEE)}
              text={t("employees.addEmployee")}
              type="button"
              style={{ height: "49.6px", fontSize: "14px", margin: "1rem 0" }}
            />
          </Col>
        </Row>

        {/* Loading Spinner or Table */}
        <>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" />
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={memoizedData}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageCount={Math.ceil(count / 10)}
              enableSorting={true}
            />
          )}
        </>
      </Stack>

      {/* Delete Employee Modal */}
      {isModalOpen && (
        <ModalComponent
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleDeleteEmployee}
          modalTitle={t("employees.deleteEmp")}
          modalMessage={`${t("settings.deleteMsg")} “${
            selectedEmployee?.name
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

export default EmployessList;
