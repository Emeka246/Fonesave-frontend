import * as React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IconTransfer, IconMessage, IconShoppingCart, IconGift, IconEdit } from "@tabler/icons-react"
import { toast } from "sonner"
import { initiateOwnershipTransfer, InitiateTransferData } from "@/services/device.service"

interface TransferOwnershipDialogProps {
  deviceId: string;
  deviceName: string;
  trigger?: React.ReactNode;
  onTransferInitiated?: () => void;
}

export function TransferOwnershipDialog({ 
  deviceId, 
  deviceName, 
  trigger,
  onTransferInitiated
}: TransferOwnershipDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    transferType: 'selling',
    transferMessage: '',
    customMessage: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.transferType === 'others' && !formData.customMessage.trim()) {
      toast.error('Please enter a custom message for the transfer')
      return
    }

    // Close the form dialog and open confirmation dialog
    setOpen(false)
    setConfirmationOpen(true)
  }

  const handleConfirmTransfer = async () => {
    setLoading(true)
    try {
      // Create transfer message based on type
      let transferMessage = ''
      switch (formData.transferType) {
        case 'selling':
          transferMessage = 'I am selling this device to you.'
          break
        case 'giving':
          transferMessage = 'I am giving this device to you as a gift.'
          break
        case 'others':
          transferMessage = formData.customMessage.trim()
          break
      }

      const transferData: InitiateTransferData = {
        deviceId,
        transferMessage: transferMessage,
        transferType: formData.transferType as 'selling' | 'giving' | 'others'
      }

      const response = await initiateOwnershipTransfer(transferData)
      if (response?.success) {
        toast.success('Device transferred and removed from your account successfully!')
        setConfirmationOpen(false)
        setFormData({ transferType: 'selling', transferMessage: '', customMessage: '' })
        onTransferInitiated?.()
      } else {
        throw new Error(response?.message || 'Failed to transfer device')
      }
    } catch (error: any) {
      console.error('Transfer initiation error:', error)
      toast.error(error?.data?.message || error.message || 'Failed to initiate ownership transfer')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }


  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="sm:text-base text-xs">
            <IconTransfer className="mr-2 size-4" />
            Transfer Ownership
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconTransfer className="h-5 w-5" />
            Transfer / Delete Device
          </DialogTitle>
          <DialogDescription className="text-xs">
            Transfer <strong>{deviceName}</strong> to another person or delete it from your account. 
            This action will remove the device from your account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transfer Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Transfer Type *</Label>
            <RadioGroup
              value={formData.transferType}
              onValueChange={(value) => handleInputChange('transferType', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selling" id="selling" />
                <Label htmlFor="selling" className="flex items-center gap-2 cursor-pointer">
                  <IconShoppingCart className="h-4 w-4" />
                  Selling it to someone else
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="giving" id="giving" />
                <Label htmlFor="giving" className="flex items-center gap-2 cursor-pointer">
                  <IconGift className="h-4 w-4" />
                  Giving it to someone else
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="others" id="others" />
                <Label htmlFor="others" className="flex items-center gap-2 cursor-pointer">
                  <IconEdit className="h-4 w-4" />
                  Others (write custom message)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Custom Message for "Others" option */}
          {formData.transferType === 'others' && (
            <div className="space-y-2">
              <Label htmlFor="customMessage" className="flex items-center gap-2">
                <IconMessage className="h-4 w-4" />
                Custom Message *
              </Label>
              <Textarea
                id="customMessage"
                placeholder="Write your custom message for the transfer..."
                value={formData.customMessage}
                onChange={(e) => handleInputChange('customMessage', e.target.value)}
                disabled={loading}
                rows={3}
                maxLength={500}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.customMessage.length}/500 characters
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setFormData({ transferType: 'selling', transferMessage: '', customMessage: '' })
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="destructive"
            >
              {loading ? 'Processing...' : 'Transfer / Delete Device'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Confirmation Dialog */}
    <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <IconTransfer className="h-5 w-5" />
            Warning: Transfer Ownership
          </DialogTitle>
          <DialogDescription className="text-sm">
            This action will permanently remove your ownership of this device on Fonsave.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="text-sm text-red-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Once transferred, you will no longer be able to manage or update this device.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>The new owner will have full control to register and manage it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>This action cannot be undone.</span>
              </li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-600">
            <strong>Device:</strong> {deviceName}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmationOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmTransfer}
            disabled={loading}
            variant="destructive"
          >
            {loading ? 'Processing...' : 'Yes, Transfer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
