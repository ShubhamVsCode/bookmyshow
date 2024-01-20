import { ITheatreLayout, Row, Seat, TheatreSection } from "@/types/theatre";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight, Trash2Icon } from "lucide-react";
import { produce } from "immer";
import { DeleteModal } from "./DeleteModal";
import { Switch } from "./ui/switch";
import ClientLayout from "./client-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface DeleteModalState {
  open: boolean;
  index: number;
}

const AdminLayout = () => {
  const [sections, setSections] = useState<ITheatreLayout>([]);
  const [seatsInARow, setSeatsInARow] = useState(10);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    index: -1,
  });

  const handleAddSection = () => {
    const emptySection = { name: "", pricing: { IN: 0, US: 0 }, rows: [] };
    setSections([...sections, emptySection]);
  };

  function deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

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

  const createNewArrayWithObject = <T,>(n: number, object: T): T[] => {
    return Array.from({ length: n }, () => object);
  };

  const changeSeatStatus = (
    sectionIndex: number,
    rowIndex: number,
    seatIndex: number
  ) => {
    const newSections = produce(sections, (draft) => {
      draft[sectionIndex].rows[rowIndex].rowSeats[seatIndex].status =
        draft[sectionIndex].rows[rowIndex].rowSeats[seatIndex].status ===
        "available"
          ? "no-seat"
          : "available";
    });
    setSections(newSections);
  };

  const handleSeatClick = (data: {
    seat: Seat;
    row: Row;
    section: TheatreSection;
    seatIndex: number;
    rowIndex: number;
    sectionIndex: number;
  }) => {
    const seatNumber = data.seat.seatNumber;
    const rowName = data.row.rowName;
    const sectionName = data.section.name;
    console.log({
      seatNumber,
      rowName,
      sectionName,
    });

    changeSeatStatus(data.sectionIndex, data.rowIndex, data.seatIndex);
  };

  const getRowLengthsOfPreviousSections = (
    currentSectionIndex: number,
    sections: TheatreSection[]
  ) => {
    let rowLengths = 0;

    for (let i = 0; i < currentSectionIndex; i++) {
      const rowLength = sections[i].rows.length;
      rowLengths += rowLength;
    }

    return rowLengths;
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
    const totalRows = sections.reduce((acc, sec) => acc + sec.rows.length, 0);
    if (totalRows <= 0) return;

    const sequence = generateAlphabetSequence(totalRows, isAToZ);

    setSections(
      produce(sections, (draft) => {
        draft.forEach((section, sectionIndex) => {
          const prevRows = getRowLengthsOfPreviousSections(
            sectionIndex,
            sections
          );
          console.log(prevRows);
          section.rows.forEach((row, rowIndex) => {
            row.rowName = sequence[prevRows + rowIndex];
          });
        });
      })
    );
  };

  return (
    <>
      <div>
        <h1>Admin Layout</h1>

        <div>
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
                      Section {index + 1} {section.name && `| ${section.name}`}{" "}
                      {section.pricing.IN !== 0 &&
                        `| Rs. ${section.pricing.IN}`}
                      {section.rows.length > 0 &&
                        `| ${section.rows.length} ${
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
                              const newSections = produce(sections, (draft) => {
                                draft[index].name = e.target.value;
                              });
                              setSections(newSections);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Price in Rs.</Label>
                          <Input
                            type="number"
                            value={
                              section.pricing.IN !== 0 ? section.pricing.IN : ""
                            }
                            onChange={(e) => {
                              const newSections = produce(sections, (draft) => {
                                draft[index].pricing.IN = Number(
                                  e.target.value
                                );
                              });
                              setSections(newSections);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Price in Dollar</Label>
                          <Input
                            type="number"
                            value={
                              section.pricing.US !== 0 ? section.pricing.US : ""
                            }
                            onChange={(e) => {
                              const newSections = produce(sections, (draft) => {
                                draft[index].pricing.US = Number(
                                  e.target.value
                                );
                              });
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
                                      status: "available",
                                    };

                                    let newSeats = createNewArrayWithObject(
                                      seatsInARow,
                                      emptySeat
                                    );

                                    newSeats = newSeats.map((seat, index) => {
                                      seat.seatNumber = index + 1;

                                      return {
                                        ...seat,
                                      };
                                    });

                                    const emptyRow: Row = {
                                      rowName: "",
                                      rowSeats: newSeats || [],
                                      type: "row",
                                    };

                                    const prevRows = draft[index].rows.length;
                                    const newRows = value - prevRows;

                                    if (newRows > 0) {
                                      const rows = createNewArrayWithObject(
                                        newRows,
                                        emptyRow
                                      );
                                      draft[index].rows =
                                        draft[index].rows.concat(rows);
                                    } else if (newRows < 0) {
                                      draft[index].rows.splice(value, -newRows);
                                    }
                                  })
                                );
                              } else if (value === 0 || e.target.value === "") {
                                setSections(
                                  produce(sections, (draft) => {
                                    draft[index].rows = [];
                                  })
                                );
                              }
                            }}
                          />
                        </div>
                        {index === 0 && (
                          <>
                            <div>
                              <Label>Automatic Row Name</Label>
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
                            <div>
                              <Label>Seats in Row</Label>
                              <Input
                                type="number"
                                min={0}
                                value={seatsInARow !== 0 ? seatsInARow : ""}
                                onChange={(e) => {
                                  setSeatsInARow(e.target.valueAsNumber);
                                }}
                              />
                            </div>
                          </>
                        )}
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
                                        draft[index].rows[rowIndex].rowName =
                                          e.target.value;
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
                                        const emptySeat: Seat = {
                                          seatNumber: 0,
                                          status: "available",
                                        };

                                        let newSeats = createNewArrayWithObject(
                                          e.target.valueAsNumber,
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

                                        draft[index].rows[rowIndex].rowSeats =
                                          newSeats;
                                      })
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`is-row-${rowIndex}-${index}`}>
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

      <div>
        <ClientLayout layout={sections} handleSeatClick={handleSeatClick} />
      </div>

      <pre>
        <code>{JSON.stringify(sections, null, 2)}</code>
      </pre>
    </>
  );
};

export default AdminLayout;
