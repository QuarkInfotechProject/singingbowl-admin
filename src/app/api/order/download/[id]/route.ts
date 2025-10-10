import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import ExcelJS from "exceljs";
import { Readable } from "stream";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get form data from request
    const formData = await request.formData();
    const orderDataString = formData.get("orderData") as string;
    const orderData = JSON.parse(orderDataString);

    // Create a new archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Create a buffer to store the ZIP file
    const chunks: any[] = [];
    archive.on("data", (chunk) => chunks.push(chunk));

    // Create promise to wait for archive to finalize
    const archiveComplete = new Promise((resolve, reject) => {
      archive.on("end", resolve);
      archive.on("error", reject);
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Order Summary Sheet
    const summarySheet = workbook.addWorksheet("Order Summary");
    summarySheet.addRows([
      ["Order Summary"],
      ...Object.entries(orderData.orderSummary).map(([key, value]) => [
        key,
        value,
      ]),
    ]);

    // Customer Information Sheet
    const customerSheet = workbook.addWorksheet("Customer Information");
    customerSheet.addRows([
      ["Customer Information"],
      ...Object.entries(orderData.customerInfo).map(([key, value]) => [
        key,
        value,
      ]),
    ]);

    // Shipping Information Sheet
    const shippingSheet = workbook.addWorksheet("Shipping Information");
    shippingSheet.addRows([
      ["Shipping Information"],
      ...Object.entries(orderData.shippingInfo).map(([key, value]) => [
        key,
        value,
      ]),
    ]);

    // Order Items Sheet
    const itemsSheet = workbook.addWorksheet("Order Items");
    if (orderData.orderItems.length > 0) {
      const headers = Object.keys(orderData.orderItems[0]);
      itemsSheet.addRow(headers);
      orderData.orderItems.forEach((item: any) => {
        itemsSheet.addRow(Object.values(item));
      });
    }

    // Coupon Information Sheet
    const couponSheet = workbook.addWorksheet("Coupon Information");
    if (orderData.couponInfo.length > 0) {
      const headers = Object.keys(orderData.couponInfo[0]);
      couponSheet.addRow(headers);
      orderData.couponInfo.forEach((coupon: any) => {
        couponSheet.addRow(Object.values(coupon));
      });
    }

    // Generate Excel buffer
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Add Excel file to archive
    archive.append(Buffer.from(excelBuffer), {
      name: `order-${params.id}.xlsx`,
    });

    // Add JSON file to archive
    archive.append(JSON.stringify(orderData, null, 2), {
      name: `order-${params.id}.json`,
    });

    // Finalize the archive
    archive.finalize();

    // Wait for archive to complete
    await archiveComplete;

    // Concatenate chunks into a single buffer
    const zipBuffer = Buffer.concat(chunks);

    // Create response with appropriate headers
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="order-${params.id}.zip"`,
      },
    });
  } catch (error) {
    console.error("Error creating ZIP:", error);
    return NextResponse.json(
      { error: "Failed to create download" },
      { status: 500 }
    );
  }
}
