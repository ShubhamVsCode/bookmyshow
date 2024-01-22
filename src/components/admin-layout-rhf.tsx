import { ITheatreLayout, TheatreSection } from "@/types/theatre";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import z from "zod";

const theatreSectionSchema = z.object({
  name: z.string(),
  pricing: z.object({
    IN: z.number(),
    US: z.number(),
  }),
  rows: z.array(
    z
      .object({
        rowName: z.string(),
        rowSeats: z.array(
          z.nullable(
            z.object({
              seatNumber: z.number(),
              status: z.string(),
            })
          )
        ),
      })
      .nullable()
  ),
});
const AdminLayout = () => {
  //   const [layout, setLayout] = useState<ITheatreLayout>([]);

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm({
    resolver: zodResolver(theatreSectionSchema),
  });

  const sectionForm = useFieldArray({
    control,
    name: "section",
  });

  const rowForm = useFieldArray({
    control,
    name: "section.rows",
  });

  const { append } = sectionForm;

  return (
    <div>
      <h1>Admin Layout</h1>

      <DevTool control={control} />
      <div>
        <Button onClick={() => append({ name: "", pricing: { IN: 0, US: 0 } })}>
          Add Section
        </Button>
      </div>
      <div>
        {sectionForm.fields.map((section, index) => {
          return (
            <div key={index}>
              <div className="grid grid-cols-[1fr_auto_auto] gap-3">
                <div>
                  <Label>Section Name</Label>
                  <Input type="text" {...register(`section.${index}.name`)} />
                </div>
                <div>
                  <Label>Price in Rs.</Label>
                  <Input
                    type="number"
                    {...register(`section.${index}.pricing.IN`, {
                      valueAsNumber: true,
                      min: 0,
                    })}
                  />
                </div>
                <div>
                  <Label>Price in Dollar</Label>
                  <Input
                    type="number"
                    {...register(`section.${index}.pricing.US`, {
                      valueAsNumber: true,
                      min: 0,
                    })}
                  />
                </div>
                <div>
                  <Label>Number of Rows</Label>
                  <Input
                    type="number"
                    {...register(`section.${index}.rows.length`)}
                  />
                </div>
              </div>
              <div>
                {sectionForm.fields.map((row, index) => {
                  return (
                    <div key={row.id}>
                      <div>
                        <Label>Row Name</Label>
                        <Input
                          type="text"
                          {...register(
                            `section.${index}.rows.${index}.rowName`
                          )}
                        />
                      </div>
                      <div>
                        <Label>Number of Seats</Label>
                        <Input
                          type="number"
                          {...register(
                            `section.${index}.rows.${index}.rowSeats.length`
                          )}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* {section.rows.map((row, index) => {
                  return (
                    <div
                      key={"row" + row?.rowName + index}
                      className="grid grid-cols-[1fr_auto_auto] gap-3"
                    >
                      <div>
                        <Label>Row Name</Label>
                        <Input
                          type="text"
                          value={section.name}
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].name = e.target.value;
                            setSections(newSections);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Number of Seats</Label>
                        <Input
                          type="number"
                          value={section.pricing.US}
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].pricing.US = Number(
                              e.target.value
                            );
                            setSections(newSections);
                          }}
                        />
                      </div>
                    </div>
                  );
                })} */}
              </div>
            </div>
          );
        })}
      </div>

      <pre>{/* <code>{JSON.stringify(sections, null, 2)}</code> */}</pre>
    </div>
  );
};

export default AdminLayout;
