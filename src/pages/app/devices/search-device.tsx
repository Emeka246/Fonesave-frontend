import DeviceByIdInput from "@/components/common/device/device-by-id-input-device"

export default function SearchDevicePage() {
  return (
    <>
      {/* Header */}
      <div>
        {/* Main Search Component */}
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <DeviceByIdInput />
          </div>
        </div>
      </div>
    </>
  )
}
