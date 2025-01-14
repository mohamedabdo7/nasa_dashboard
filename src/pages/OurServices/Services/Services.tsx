import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { i18n, showToast } from "../../../utils";
import SearchInput from "../../../components/UI/SearchInput/SearchInput";
import Button from "../../../components/UI/Button";
import { routes } from "../../../constants";
import TableComponent from "../../../components/Table/TableComponent";
import { truncateString } from "../../../utils/truncateString";
import { useFetchTableData } from "../../../hooks/useFetchTableData";
import ActionsMenu from "../../../components/UI/ActionsMenu/ActionsMenu";
import Modal from "../../../components/Modal/Modal";
import { trash } from "../../../assets/icons";
import { deleteService } from "../../../services";

const Services: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State management
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentService, setCurrentService] = useState<any>({});
  const [searchValue, setSearchValue] = useState("");
  const [listiner, setListiner] = useState(false);

  // Fetching data
  const url = "getServices";
  const { data, loading, count, setPageNumber, pageNumber } = useFetchTableData(
    searchValue,
    url,
    {},
    listiner
  );

  const memoizedData = useMemo(() => data, [data]);

  // Table columns definition
  const columns = [
    {
      Header: `${t("services.title")}`,
      accessor: `${i18n.language === "en" ? "nameEn" : "nameAr"}`,
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div>
          {truncateString(row.original.title, i18n.language !== "en", 50)}
        </div>
      ),
    },
    {
      Header: t("services.body"),
      accessor: "description",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <div>
          {truncateString(row.original.body, i18n.language !== "en", 50)}
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
              routes.EDITSERVICE.replace(":id", row.original.id.toString())
            )
          }
          onDelete={() => {
            setCurrentService(row.original);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  // Handle delete service
  const confirmDeleteHandler = async (id: string) => {
    try {
      setDeleteLoading(true);
      if (currentService.id) {
        await deleteService(id);
        setListiner((prev) => !prev);
      }
      showToast("Service deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting service", "error");
    } finally {
      setModalOpen(false);
      setDeleteLoading(false);
    }
  };

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
              placeholder={t("placeholder.searchByService")}
            />
          </Col>

          <Col md={12} lg={2}>
            <Button
              onClick={() => navigate(routes.ADDSERVICE)}
              text={t("buttons.addNewService")}
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

      {/* Delete Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => confirmDeleteHandler(currentService.id!)}
        modalIcon={trash}
        confirmBtnStyle="modal-confirm"
        closeBtnText={t("buttons.cancel")}
        confirmBtnText={t("buttons.delete")}
        modalTitle={`${t("deletsMsgs.deleteService")}  `}
        loading={deleteLoading}
      />
    </Container>
  );
};

export default Services;
