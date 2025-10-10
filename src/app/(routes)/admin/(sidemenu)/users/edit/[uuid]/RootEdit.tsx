"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  phoneNo: z.string().min(1, "Phone number is required."),
  dateOfBirth: z.string().nullable().optional(),
  // dateOfBirth: z.string().min(1, "Date of birth is required."),
  gender: z.string().nullable().optional(),
  offersNotification: z.boolean().optional(),
  profilePicture: z.string().optional(),
  remarks: z.string().optional(),
  billingAddress: z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    mobile: z.string().min(1, "Mobile number is required."),
    backupMobile: z.string().optional(),
    address: z.string().min(1, "Address is required."),
    zoneName: z.string().min(1, "Zone is required."),
    cityName: z.string().min(1, "City is required."),
    provinceName: z.string().min(1, "Province is required."),
    countryName: z.string().min(1, "Country is required."),
    cityId: z.number().optional(),
    zoneId: z.number().optional(),
    provinceId: z.number().optional(),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface RootEditProps {
  userData: FormData;
  loading: boolean;
  IdData: string;
}

const RootEdit: React.FC<RootEditProps> = ({ userData, loading, IdData }) => {
  const [city, setCity] = useState();
  const { data, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_USER_ORIGIN}/user/locations`
      );
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    },
  });
  const locationData = data?.data || {};
  const [selectedProvience, setSelectedProvience] = useState(
    userData?.billingAddress[0]?.provinceName || ""
  );
  const [selectedCity, setSelectedCity] = useState();
  const [selectedZone, setSelectedZone] = useState();
  const [zone, setZone] = useState([]);
  const provience = locationData ? Object.keys(locationData) : [];
  useEffect(() => {
    if (locationData[selectedProvience]) {
      const relativeCity = locationData[selectedProvience];
      setCity(relativeCity);
    }
  }, [selectedProvience, provience]);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phoneNo: userData?.phoneNo || "",
      dateOfBirth: userData?.dateOfBirth || " ",
      gender: userData?.gender || " ",
      profilePicture: userData?.profilePicture || "",
      offersNotification: userData?.offersNotification ? true : false,
      remarks: userData?.remarks,
      billingAddress: userData?.billingAddress?.[0] || {
        firstName: "",
        lastName: "",
        mobile: "",
        backupMobile: "",
        address: "",
        zoneName: "",
        cityName: "",
        provinceName: "",
        countryName: "",
        cityId: "",
        zoneId: "",
        provinceId: "",
      },
    },
  });

  useEffect(() => {
    const currentZones = city?.filter(
      (city) => city.name === form.getValues("billingAddress.cityName")
    );
    setZone(currentZones || []);
  }, [selectedCity, city]);
  const { toast } = useToast();
  const router = useRouter();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    if (userData) {
      form.setValue("email", userData.email);
      form.setValue("fullName", userData.fullName);
      form.setValue("phoneNo", userData.phoneNo || "");
      form.setValue("dateOfBirth", userData.dateOfBirth);
      form.setValue("gender", userData?.gender);
      form.setValue("profilePicture", userData.profilePicture || "");
      form.setValue(
        "offersNotification",
        userData?.offersNotification || false
      );
      form.setValue("remarks", userData?.remarks || "");
      form.setValue(
        "billingAddress.firstName",
        userData.billingAddress?.[0]?.firstName || ""
      );
      form.setValue(
        "billingAddress.lastName",
        userData.billingAddress?.[0]?.lastName || ""
      );
      form.setValue(
        "billingAddress.mobile",
        userData.billingAddress?.[0]?.mobile || ""
      );
      form.setValue(
        "billingAddress.address",
        userData.billingAddress?.[0]?.address || ""
      );
      form.setValue(
        "billingAddress.zoneName",
        userData.billingAddress?.[0]?.zoneName || ""
      );
      form.setValue(
        "billingAddress.cityName",
        userData.billingAddress?.[0]?.cityName || ""
      );
      form.setValue(
        "billingAddress.provinceName",
        userData.billingAddress?.[0]?.provinceName || ""
      );
      form.setValue(
        "billingAddress.countryName",
        userData.billingAddress?.[0]?.countryName || ""
      );
      form.setValue(
        "billingAddress.backupMobile",
        userData.billingAddress?.[0]?.backupMobile || ""
      );
      form.setValue(
        "billingAddress.zoneId",
        userData.billingAddress?.[0]?.zoneId
      );
      form.setValue(
        "billingAddress.provinceId",
        userData.billingAddress?.[0]?.provinceId
      );

      form.setValue(
        "billingAddress.cityId",
        userData.billingAddress?.[0]?.cityId
      );
      form.setValue(
        "billingAddress.backupMobile",
        userData.billingAddress?.[0]?.backupMobile || " "
      );
    }
  }, [userData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newData = {
        ...values,
        id: IdData,
        offersNotification: values.offersNotification ? "1" : "0",

        billingAddress: {
          ...values.billingAddress,
          backupMobile: values?.billingAddress?.backupMobile?.toString(),
          provinceId: 1,
          cityId: parseInt(
            selectedCity?.id ? selectedCity?.id : values?.billingAddress.cityId
          ),
          zoneId: parseInt(
            selectedZone?.id ? selectedZone?.id : values?.billingAddress.zoneId
          ),
        },
      };

      const response = await axios.post("/api/end-users/update", newData);

      if (response.status === 200) {
        toast({
          description: `${response?.data?.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
      }
      router.push("/admin/users");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const errors = error.response.data.errors;

        for (const field in errors) {
          if (Object.hasOwnProperty.call(errors, field)) {
            toast({
              description: `${errors[field]}`,
              className: "bg-red-500 text-white font-semibold",
            });
          }
        }
      } else {
        toast({
          description: "An error occurred while submitting the form.",
          className: "bg-red-500 text-white font-semibold",
        });
      }
    }
  };

  const handleProvienceChange = (value) => {
    setSelectedProvience(value);
    form.setValue("cityName", "");
  };
  const handleCityChnage = (selCity) => {
    setSelectedCity(selCity);
    form.setValue("zoneName", "");
  };

  const handelZoneChnages = (selZone) => {
    setSelectedZone(selZone);
  };
  return (
    <Card className="w-full h-full max-w-7xl ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit User</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full w-full p-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center space-y-1">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={userData?.profilePicture} />
                  <AvatarFallback>
                    {getInitials(userData?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-medium">{userData?.fullName}</h2>
              </div>
              <Separator className="mt-5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 space-x-10 mt-5">
                <div className="space-y-3">
                  <p className="font-semibold text-xl mb-4">Personal detail</p>
                  {/* Full Name Field */}

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Full Name:
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="text" disabled {...field} />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    // defaultValue={userData?.email}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Email:
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="email" disabled {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Gender:
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            defaultValue=""
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    defaultValue={userData?.dateOfBirth}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Date of Birth:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            defaultValue={userData?.dateOfBirth || ""}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Remarks:
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="text" {...field} />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-start items-center  space-x-5">
                    <div>
                      <p>OffersNotification :</p>
                    </div>
                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="offersNotification"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                {...field}
                                defaultChecked={
                                  field?.value === "0" ? false : true
                                }
                              />
                            </FormControl>
                            <FormMessage>
                              {fieldState.error?.message}
                            </FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                {/* Billing starts */}

                <div>
                  <p className="font-semibold text-xl mb-4">Billing Info</p>
                  <div className="space-x-2 space-y-3">
                    <FormField
                      control={form.control}
                      name="billingAddress.firstName"
                      defaultValue={
                        userData?.billingAddress?.firstName || "N/A"
                      }
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            First Name:
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress.lastName"
                      defaultValue={userData?.billingAddress?.lastName || "N/A"}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Last Name:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last Name"
                              {...field}
                              defaultValue={
                                userData?.billingAddress?.lastName || "N/A"
                              }
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress.mobile"
                      defaultValue={userData?.billingAddress.mobile || "N/A"}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Mobile:
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Mobile" {...field} />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress.backupMobile"
                      defaultValue={
                        userData?.billingAddress?.backupMobile || "N/A"
                      }
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Backup Mobile:
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="backupMobile" {...field} />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.address"
                      defaultValue={userData?.billingAddress?.address || "N/A"}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Address:
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Address" {...field} />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress.countryName"
                      defaultValue={
                        userData?.billingAddress?.countryName || "N/A"
                      }
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Country :
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="CountryName" {...field} />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />

                    {/* --------- */}
                    <FormField
                      control={form.control}
                      name="billingAddress.provinceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Province :
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProvienceChange(value || field.value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  {field.value || "Select a Provience"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {provience?.map((prov) => (
                                  <SelectItem key={prov} value={prov}>
                                    {prov}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.cityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            City :
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(selectedCityName) => {
                                const selectedCity = city?.find(
                                  (prov) => prov.name === selectedCityName
                                );

                                if (selectedCity) {
                                  field.onChange(selectedCityName);
                                  handleCityChnage(selectedCity);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  {field.value || "Select a city"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {city?.map((prov) => (
                                  <SelectItem key={prov.id} value={prov.name}>
                                    {prov.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress.zoneName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Zone :
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(selectedZoneName) => {
                                const selectedZone = selectedCity?.zones.find(
                                  (zone) => zone.name === selectedZoneName
                                );

                                if (selectedZoneName) {
                                  field.onChange(selectedZoneName);
                                  handelZoneChnages(selectedZone);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  {field.value || "Select a zone"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {zone[0]?.zones?.map((zone) => (
                                  <SelectItem key={zone.id} value={zone.name}>
                                    {zone.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* --------- */}
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                className="bg-[#5e72e4] hover:bg-[#465ad1] top-3"
              >
                Submit
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootEdit;
