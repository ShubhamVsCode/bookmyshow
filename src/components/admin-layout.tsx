import {
  ITheatreLayout,
  Row,
  Seat,
  SeatStatus,
  TheatreSection,
} from "@/types/theatre";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CheckCircle,
  CrownIcon,
  ListChecks,
  MinusSquareIcon,
  Trash2Icon,
  XCircle,
} from "lucide-react";
import { produce } from "immer";
import { DeleteModal } from "./DeleteModal";
import { Switch } from "@/components/ui/switch";
import ClientLayout from "./client-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

interface DeleteModalState {
  open: boolean;
  index: number;
}

const AdminLayout = () => {
  const [sections, setSections] = useState<ITheatreLayout>([]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [seatsInARow, setSeatsInARow] = useState(10);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    index: -1,
  });

  const handleAddSection = () => {
    const emptySection = { name: "", pricing: { IN: 0, US: 0 }, rows: [] };
    setSections([...sections, emptySection]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleRemoveSection = (index: number) => {
    const emptySection = { name: "", pricing: { IN: 0, US: 0 }, rows: [] };
    const sectionToRemove = sections[index];

    if (!deepEqual(sectionToRemove, emptySection)) {
      setDeleteModal({
        open: true,
        index,
      });
      return;
    }

    removeSection(index);
  };

  const deepEqual = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const createNewArrayWithObject = <T,>(n: number, object: T): T[] => {
    return Array.from({ length: n }, () => object);
  };

  const getRowLengthsOfPreviousSections = (
    currentSectionIndex: number,
    sections: TheatreSection[],
    filterNoRow?: boolean
  ) => {
    let rowLengths = 0;

    for (let i = 0; i < currentSectionIndex; i++) {
      const rowLength = filterNoRow
        ? sections[i].rows.filter((r) => r.type !== "no-row").length
        : sections[i].rows.length;
      rowLengths += rowLength;
    }

    return rowLengths;
  };

  const changeSeatStatus = (
    status: SeatStatus,
    sectionIndex: number,
    rowIndex: number,
    seatIndex: number
  ) => {
    setSections((prevSections) =>
      produce(prevSections, (draft) => {
        draft[sectionIndex].rows[rowIndex].rowSeats[seatIndex].status = status;
      })
    );
  };

  const handleSeatClick = (data: {
    seat: Seat;
    row: Row;
    section: TheatreSection;
    seatIndex: number;
    rowIndex: number;
    sectionIndex: number;
    status: SeatStatus;
  }) => {
    const seatNumber = data.seat.seatNumber;
    const rowName = data.row.rowName;
    const sectionName = data.section.name;

    changeSeatStatus(
      data.status,
      data.sectionIndex,
      data.rowIndex,
      data.seatIndex
    );
  };

  const generateAlphabetSequence = (rowLength: number, isAToZ: boolean) => {
    const startChar = isAToZ
      ? "A"
      : String.fromCharCode("A".charCodeAt(0) + rowLength - 1);
    const endChar = isAToZ
      ? String.fromCharCode("A".charCodeAt(0) + rowLength - 1)
      : "A";

    const sequence = [];
    let currentChar = startChar;

    while (currentChar !== endChar) {
      sequence.push(currentChar);

      if (isAToZ) {
        currentChar = String.fromCharCode(currentChar.charCodeAt(0) + 1);
      } else {
        currentChar = String.fromCharCode(currentChar.charCodeAt(0) - 1);
      }
    }

    sequence.push(endChar);

    return sequence;
  };

  const handleRowName = (isAToZ: boolean) => {
    const totalRows = sections.reduce(
      (acc, sec) => acc + sec.rows.filter((r) => r.type !== "no-row").length,
      0
    );
    if (totalRows <= 0) return;

    const sequence = generateAlphabetSequence(totalRows, isAToZ);

    setSections(
      produce(sections, (draft) => {
        draft.forEach((section, sectionIndex) => {
          const prevRows = getRowLengthsOfPreviousSections(
            sectionIndex,
            sections,
            true
          );

          let noRowCount = 0;

          section.rows.forEach((row, rowIndex) => {
            if (row.type === "no-row") {
              noRowCount++;
            } else {
              row.rowName = sequence[prevRows - noRowCount + rowIndex];
            }
          });
        });
      })
    );
  };

  const handleSeatNumbering = (isAscending: boolean) => {
    setSections((prevSections) => {
      return produce(prevSections, (draft) => {
        draft.forEach((section) => {
          section.rows.forEach((row) => {
            if (row.type !== "no-row") {
              row.rowSeats
                .filter((seat) => seat.status !== "no-seat")
                .forEach((seat, seatIndex) => {
                  if (isAscending) {
                    seat.seatNumber = seatIndex + 1;
                  } else {
                    seat.seatNumber = row.rowSeats.length - seatIndex;
                  }
                });

              row.rowSeats
                .filter((seat) => seat.status === "no-seat")
                .forEach((seat) => {
                  seat.seatNumber = -1;
                });
            }
          });
        });
      });
    });
  };

  const handleMultiSeatStatusChange = (status: SeatStatus) => {
    const seats: {
      sectionIndex: number;
      rowIndex: number;
      seatIndex: number;
    }[] = Array.from(selected).map((key) => {
      const indexes = key.split("-");
      const seatIndex = indexes[1];
      const rowIndex = indexes[3];
      const sectionIndex = indexes[5];
      return {
        sectionIndex: parseInt(sectionIndex),
        rowIndex: parseInt(rowIndex),
        seatIndex: parseInt(seatIndex),
      };
    });

    seats.forEach((seat) => {
      changeSeatStatus(
        status,
        seat.sectionIndex,
        seat.rowIndex,
        seat.seatIndex
      );
    });

    setSelected(new Set());
    handleSeatNumbering(true);
  };

  const handleApplyAllRows = (seats: number) => {
    setSections((prevSections) => {
      return produce(prevSections, (draft) => {
        const emptySeat: Seat = {
          seatNumber: 0,
          status: SeatStatus.AVAILABLE,
        };

        draft.forEach((section, index) => {
          section.rows.forEach((row, rowIndex) => {
            row.rowSeats.forEach((seat, seatIndex) => {
              const prevSeats = draft[index].rows[rowIndex].rowSeats;

              const newSeatsLength = seats - prevSeats.length;

              if (newSeatsLength > 0) {
                let newSeats = createNewArrayWithObject(
                  newSeatsLength,
                  emptySeat
                );

                newSeats = newSeats.map((seat, index) => {
                  seat.seatNumber =
                    prevSeats.filter((s) => s.status !== SeatStatus.NO_SEAT)
                      .length +
                    index +
                    1;

                  return {
                    ...seat,
                  };
                });

                draft[index].rows[rowIndex].rowSeats =
                  draft[index].rows[rowIndex].rowSeats.concat(newSeats);
              } else if (newSeatsLength < 0) {
                draft[index].rows[rowIndex].rowSeats.splice(
                  seats,
                  -newSeatsLength
                );
              }
            });
          });
        });
      });
    });
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="">
          <div className="">
            <div className="flex justify-between gap-3 items-end px-4 min-h-20 border-b border-gray-700 pb-2 mb-4">
              {selected.size > 0 ? (
                <>
                  <div className="flex gap-3">
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        handleMultiSeatStatusChange(SeatStatus.NO_SEAT)
                      }
                    >
                      <MinusSquareIcon className="w-4 h-4 mr-2 text-gray-400" />
                      No Seat
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        handleMultiSeatStatusChange(SeatStatus.RESERVED)
                      }
                    >
                      <CrownIcon className="w-4 h-4 mr-2 text-red-500" />
                      Reserved
                    </Button>
                    <Button
                      variant={"outline"}
                      onClick={() =>
                        handleMultiSeatStatusChange(SeatStatus.AVAILABLE)
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      Available
                    </Button>
                  </div>

                  <Button
                    variant={"ghost"}
                    onClick={() => setSelected(new Set())}
                  >
                    <XCircle />
                  </Button>
                </>
              ) : (
                <>
                  {/* <Button
                    variant={"secondary"}
                    onClick={() => handleSeatNumbering(true)}
                  >
                    Arrange Seat Numbers
                  </Button> */}
                  <div>
                    <Label>Row Name</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant={"outline"}
                        className=""
                        onClick={() => handleRowName(true)}
                      >
                        A <ArrowRight className="w-4 h-4 mx-1" /> Z
                      </Button>
                      <Button
                        variant={"outline"}
                        className=""
                        onClick={() => handleRowName(false)}
                      >
                        Z <ArrowRight className="w-4 h-4 mx-1" /> A
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div>
                      <Label>Seats in Row</Label>
                      <Input
                        className="w-20"
                        type="number"
                        min={0}
                        value={seatsInARow !== 0 ? seatsInARow : ""}
                        onChange={(e) => {
                          setSeatsInARow(e.target.valueAsNumber);
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        variant={"outline"}
                        className=""
                        onClick={() => handleApplyAllRows(seatsInARow)}
                      >
                        <ListChecks className="w-4 h-4 mr-2" /> Apply to All
                        Rows
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="overflow-auto">
              <ClientLayout
                layout={sections}
                handleSeatClick={handleSeatClick}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="px-5 max-h-screen overflow-auto">
            <h1>Admin Layout</h1>

            <div className="flex gap-3 items-end">
              <Button onClick={handleAddSection}>Add Section</Button>
            </div>

            <div>
              <DeleteModal
                title="Delete Section"
                description="Are you sure you want to delete this section?"
                buttonText="Delete"
                onConfirm={() => {
                  removeSection(deleteModal.index);
                  setDeleteModal({ open: false, index: -1 });
                }}
                open={deleteModal.open}
                close={() => {
                  setDeleteModal({ open: false, index: -1 });
                }}
              />
            </div>

            <div>
              <Accordion type="multiple">
                {sections.map((section, index) => {
                  return (
                    <AccordionItem
                      key={`section-${index + 1}`}
                      value={`section-${index + 1}`}
                    >
                      <AccordionTrigger className="grid grid-cols-[1fr_auto_auto] gap-3">
                        <span className="text-left">
                          Section {index + 1}{" "}
                          {section.name && `| ${section.name}`}
                          {section.pricing.IN !== 0 &&
                            ` | Rs. ${section.pricing.IN}`}
                          {section.rows.length > 0 &&
                            ` | ${section.rows.length} ${
                              section.rows.length > 1 ? "rows" : "row"
                            }`}
                        </span>
                        <Button
                          variant={"destructive"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSection(index);
                          }}
                        >
                          <Trash2Icon />
                        </Button>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="mb-4 bg-slate-900 rounded-lg px-5 py-4">
                          <div className="grid grid-cols-[1fr_.5fr_.5fr] gap-3">
                            <div>
                              <Label>Section Name</Label>
                              <Input
                                type="text"
                                value={section.name}
                                onChange={(e) => {
                                  const newSections = produce(
                                    sections,
                                    (draft) => {
                                      draft[index].name = e.target.value;
                                    }
                                  );
                                  setSections(newSections);
                                }}
                              />
                            </div>
                            <div>
                              <Label>Price in Rs.</Label>
                              <Input
                                type="number"
                                value={
                                  section.pricing.IN !== 0
                                    ? section.pricing.IN
                                    : ""
                                }
                                onChange={(e) => {
                                  const newSections = produce(
                                    sections,
                                    (draft) => {
                                      draft[index].pricing.IN = Number(
                                        e.target.value
                                      );
                                    }
                                  );
                                  setSections(newSections);
                                }}
                              />
                            </div>
                            <div>
                              <Label>Price in Dollar</Label>
                              <Input
                                type="number"
                                value={
                                  section.pricing.US !== 0
                                    ? section.pricing.US
                                    : ""
                                }
                                onChange={(e) => {
                                  const newSections = produce(
                                    sections,
                                    (draft) => {
                                      draft[index].pricing.US = Number(
                                        e.target.value
                                      );
                                    }
                                  );
                                  setSections(newSections);
                                }}
                              />
                            </div>

                            <div>
                              <Label>Number of Rows</Label>
                              <Input
                                max={26}
                                type="number"
                                value={
                                  section.rows.length !== 0
                                    ? section.rows.length
                                    : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.valueAsNumber;
                                  if (value > 0 && value < 1000) {
                                    setSections(
                                      produce(sections, (draft) => {
                                        const emptySeat: Seat = {
                                          seatNumber: 0,
                                          status: SeatStatus.AVAILABLE,
                                        };

                                        let newSeats = createNewArrayWithObject(
                                          seatsInARow,
                                          emptySeat
                                        );

                                        newSeats = newSeats.map(
                                          (seat, index) => {
                                            seat.seatNumber = index + 1;

                                            return {
                                              ...seat,
                                            };
                                          }
                                        );

                                        const emptyRow: Row = {
                                          rowName: "",
                                          rowSeats: newSeats || [],
                                          type: "row",
                                        };

                                        const prevRows =
                                          draft[index].rows.length;
                                        const newRows = value - prevRows;

                                        if (newRows > 0) {
                                          const rows = createNewArrayWithObject(
                                            newRows,
                                            emptyRow
                                          );
                                          draft[index].rows =
                                            draft[index].rows.concat(rows);
                                        } else if (newRows < 0) {
                                          draft[index].rows.splice(
                                            value,
                                            -newRows
                                          );
                                        }
                                      })
                                    );
                                  } else if (
                                    value === 0 ||
                                    e.target.value === ""
                                  ) {
                                    setSections(
                                      produce(sections, (draft) => {
                                        draft[index].rows = [];
                                      })
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            {section.rows.map((row, rowIndex) => {
                              return (
                                <div
                                  key={"row" + rowIndex}
                                  className="grid grid-cols-[1fr_auto_auto] gap-3"
                                >
                                  <div>
                                    <Label>Row Name</Label>
                                    <Input
                                      type="text"
                                      value={row.rowName}
                                      disabled={row.type === "no-row"}
                                      onChange={(e) => {
                                        setSections(
                                          produce(sections, (draft) => {
                                            draft[index].rows[
                                              rowIndex
                                            ].rowName = e.target.value;
                                          })
                                        );
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label>Number of Seats</Label>
                                    <Input
                                      type="number"
                                      disabled={row.type === "no-row"}
                                      value={
                                        row.rowSeats.length !== 0
                                          ? row.rowSeats.length
                                          : ""
                                      }
                                      onChange={(e) => {
                                        setSections(
                                          produce(sections, (draft) => {
                                            const value =
                                              e.target.valueAsNumber;

                                            const emptySeat: Seat = {
                                              seatNumber: 0,
                                              status: SeatStatus.AVAILABLE,
                                            };

                                            const prevSeats =
                                              draft[index].rows[rowIndex]
                                                .rowSeats;

                                            const newSeatsLength =
                                              value - prevSeats.length;

                                            if (newSeatsLength > 0) {
                                              let newSeats =
                                                createNewArrayWithObject(
                                                  newSeatsLength,
                                                  emptySeat
                                                );

                                              newSeats = newSeats.map(
                                                (seat, index) => {
                                                  seat.seatNumber =
                                                    prevSeats.filter(
                                                      (s) =>
                                                        s.status !==
                                                        SeatStatus.NO_SEAT
                                                    ).length +
                                                    index +
                                                    1;

                                                  return {
                                                    ...seat,
                                                  };
                                                }
                                              );

                                              draft[index].rows[
                                                rowIndex
                                              ].rowSeats =
                                                draft[index].rows[
                                                  rowIndex
                                                ].rowSeats.concat(newSeats);
                                            } else if (newSeatsLength < 0) {
                                              draft[index].rows[
                                                rowIndex
                                              ].rowSeats.splice(
                                                value,
                                                -newSeatsLength
                                              );
                                            }
                                          })
                                        );
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`is-row-${rowIndex}-${index}`}
                                    >
                                      Is Row?
                                    </Label>
                                    <div className="">
                                      <Switch
                                        id={`is-row-${rowIndex}-${index}`}
                                        onCheckedChange={(checked) => {
                                          setSections(
                                            produce(sections, (draft) => {
                                              draft[index].rows[rowIndex].type =
                                                checked ? "row" : "no-row";
                                            })
                                          );
                                        }}
                                        checked={row.type === "row"}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </ResizablePanel>

        {/* <pre>
        <code>{JSON.stringify(sections, null, 2)}</code>
      </pre> */}
      </ResizablePanelGroup>
    </>
  );
};

export default AdminLayout;
