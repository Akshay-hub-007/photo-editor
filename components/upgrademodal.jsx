import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Crown, Zap } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { PricingTable } from '@clerk/nextjs'
import { Button } from './ui/button'

function UpgradeModal({ isOpen, onClose, restrictedTool, reason }) {

  const getToolName = (toolId) => {
    const obj = {
      background: "AI background  Tools",
      ai_extender: "AI Image Extender",
      ai_edit: "AI Editor",
      projects:"More Than 3 Projects"
    }

    return obj[toolId] || "Premium Feature"
  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent  className={"sm:max-w-4xl bg-slate-800 border-white/10 max-h-[90vh] overflow-y-auto"}>
          <DialogHeader>
            <div className='flex items-center gap-3'>
              <Crown className='h-6 w-6  text-yellow-500' />
              <DialogTitle className={"text-2xl font-bold text-white"}>
                Upgrade to Pro
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className='spca-y-6'>
            {
              restrictedTool && (
                <Alert className={"bg-amber-500/10 border-amber-500/20"}>
                  <Zap className='w-5 h-5 text-amber-400'/>
                  <AlertDescription className={"text-amber-400"}>
                    <div className='font-semibold text-amber-400 mb-1'>
                      {getToolName(restrictedTool)} - Pro Feature
                    </div>

                    {
                      reason || 
                      `${getToolName(restrictedTool)} is available on  the Pro plan.Upgrade now to unlock the powerful future and more.`
                    }

                  </AlertDescription>

                </Alert>
              )
            }
          <PricingTable
          checkoutProps={{
            appearance:{
              elements:{
                drawerRoot:{
                  zIndex:20000,
                }
              }
            }
          }}
          />
          </div>
          <DialogFooter>
            <Button
            variant="ghost"
            onClick={onClose}
            className={"text-white/70 "}
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpgradeModal
