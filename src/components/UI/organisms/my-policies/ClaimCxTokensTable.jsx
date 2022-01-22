import { useState } from "react";

import {
  Table,
  TBody,
  TableWrapper,
  THead,
} from "@/components/UI/organisms/Table";
import { classNames } from "@/utils/classnames";
import { ClaimCoverModal } from "@/components/UI/organisms/my-policies/ClaimCoverModal";
import { cxTokenSymbol } from "@/src/config/constants";
import { weiAsAmount } from "@/utils/bn";
import { unixToDate } from "@/utils/date";

const renderHeader = (col) => (
  <th
    scope="col"
    className={classNames(
      `px-6 py-6 font-bold text-sm uppercase`,
      col.align === "right" ? "text-right" : "text-left"
    )}
  >
    {col.name}
  </th>
);

const renderAddress = (row) => (
  <td className="px-6 py-6 text-404040">{row.cxToken}</td>
);

const renderClaimBefore = (row) => (
  <td className="px-6 py-6">
    <span className="text-left whitespace-nowrap ">
      {`${unixToDate(row.expiresOn, "MM/DD/YYYY HH:mm:ss")} UTC`}
    </span>
  </td>
);

const renderAmount = (row) => (
  <td className="px-6 py-6 text-right">
    <span className="">
      {weiAsAmount(row.totalAmountToCover)} {cxTokenSymbol}
    </span>
  </td>
);

const renderActions = (row) => {
  return <ClaimActionsColumnRenderer row={row} />;
};

const columns = [
  {
    name: "cxToken Address",
    align: "left",
    renderHeader,
    renderData: renderAddress,
  },
  {
    name: "Claim before",
    align: "left",
    renderHeader,
    renderData: renderClaimBefore,
  },
  {
    name: "Amount",
    align: "right",
    renderHeader,
    renderData: renderAmount,
  },
  {
    name: "",
    align: "right",
    renderHeader,
    renderData: renderActions,
  },
];

export const ClaimCxTokensTable = ({ activePolicies }) => {
  return (
    <>
      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          <TBody columns={columns} data={activePolicies}></TBody>
        </Table>
      </TableWrapper>
    </>
  );
};

const ClaimActionsColumnRenderer = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    setIsOpen(true);
  };

  return (
    <td className="text-right px-6 py-6" style={{ minWidth: "120px" }}>
      <button
        className="text-4e7dd9 hover:underline cursor-pointer"
        onClick={handleClaim}
      >
        Claim
      </button>

      <ClaimCoverModal
        data={row}
        coverKey={row.cover.id}
        cxTokenAddress={row.cxToken}
        isOpen={isOpen}
        onClose={onClose}
        modalTitle="Claim Cover"
      />
    </td>
  );
};
