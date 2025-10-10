import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IoIosArrowBack } from "react-icons/io";
import { userLocationFetch } from "@/app/_utils/userLocationFetch";
const userSchema = z.object({
  orderId: z.string().nullable(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  mobile: z.string().min(10, "Mobile must be 10 digits"),
  backupMobile: z.string().nullable().optional(),
  address: z.string().min(2, "Address is required"),
  countryName: z.string().min(1, "Country is required"),
  provinceName: z.string().min(1, "Province is required"),
  cityName: z.string().min(1, "City is required"),
  zoneName: z.string().min(1, "Zone is required"),
  provinceId: z.number().min(1, "Province ID is required"),
  cityId: z.number().min(1, "City ID is required"),
  zoneId: z.number().min(1, "Zone ID is required"),
});

const RootEdit = ({ id, editData }) => {
  const [city, setCity] = useState();
  const [locationData, setLocationData] = useState({});
  const [selectedProvience, setSelectedProvience] = useState(
    editData?.provinceName
  );
  const [selectedCity, setSelectedCity] = useState();
  const [selectedZone, setSelectedZone] = useState();
  const [zone, setZone] = useState([]);
  const provience = locationData ? Object.keys(locationData) : [];
  const selectedProvienceId = provience?.findIndex(
    (prov) => prov === selectedProvience
  );

  useEffect(() => {
    const getLocation = async () => {
      const url = `/user/locations`;
      const res = await userLocationFetch({
        url: url,
        method: "get",
        debug: true,
        toast,
      });
      if (res?.status === 200) {
        setLocationData(res?.data?.data);
      }
    };
    getLocation();
  }, []);
  useEffect(() => {
    if (locationData[selectedProvience]) {
      const relativeCity = locationData[selectedProvience];
      setCity(relativeCity);
    }
  }, [selectedProvience, provience]);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      orderId: id,
      firstName: editData?.firstName || "",
      lastName: editData?.lastName || "",
      mobile: editData?.mobile || "",
      backupMobile: editData?.backupMobile || "",
      address: editData?.address || "",
      countryName: editData?.countryName || "",
      provinceName: editData?.provinceName || "",
      provinceId: editData?.provinceId || "",
      cityName: editData?.cityName || "",
      cityId: editData?.cityId || "",
      zoneName: editData?.zoneName || "",
      zoneId: editData?.zoneId || "",
    },
  });
  useEffect(() => {
    const currentZones = city?.filter(
      (city) => city.name === form.getValues("cityName")
    );
    setZone(currentZones || []);
  }, [selectedCity, city, selectedZone]);
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values) => {
    const newData = {
      orderId: id,
      billingAddress: {
        ...values,
        provinceId:
          selectedProvienceId > 0
            ? selectedProvienceId + 1
            : values?.provinceId,
        cityId: selectedCity?.id ? selectedCity?.id : values?.cityId,
        zoneId: selectedZone?.id ? selectedZone?.id : values?.zoneId,
      },
    };

    try {
      const response = await axios.post("/api/orders/update", newData);
      if (response.status === 200) {
        toast({
          description: `${response?.data?.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
      }
      router.push("/admin/orders");
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
  const handleBack = () => {
    router.push("/admin/orders");
  };
  return (
    <Card className="w-full h-full max-w-7xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
          <div>
            <Button
              onClick={handleBack}
              variant="outline"
              size="xs"
              className="flex items-center justify-center p-1"
            >
              <IoIosArrowBack className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <p> Edit Shipping Address</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="orderId"
                  defaultValue={id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Order Id" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Mobile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backupMobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backup Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Backup Mobile" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provinceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
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
                              {field.value || "Select a province"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {provience?.map((prov, index) => (
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
                  name="cityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
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
                  name="zoneName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(selectedZoneName) => {
                            const selectedZone = selectedCity?.zones.find(
                              (zone: any) => zone.name === selectedZoneName
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
                              <SelectItem key={zone.id} value={zone?.name}>
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
              </div>
            </div>
            <div>
              <Button
                className="bg-[#5e72e4] hover:bg-[#465ad1] top-4"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootEdit;
