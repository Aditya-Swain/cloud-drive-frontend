import React, { useState } from 'react'
import './CloudSync.css'
import arrowLeft from '../../assets/arrow-left.png'
import arrowRight from '../../assets/arrow-right.png'
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import TransitionsModal from '../../components/TransitionModal';

export default function CloudSyncComponent() {

    const [syncBtnText, setSyncBtnText] = useState('two');
     const [open, setOpen] = React.useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);

    const handleSwitchSync = () => {
        if (syncBtnText === 'two') {
            setSyncBtnText('one')
        }
        else {
            setSyncBtnText('two')
        }
    }






    return (
        <>
            <div style={{ marginLeft: "250px", padding: '20px' }}>

                <h4>Cloud Sync</h4>
                <span>Use the below boxes to choose drive accounts to sync</span>

                <div className='boxes mt-5 d-flex'>
                    <div className='sync-box' data-bs-toggle="modal" data-bs-target="#fromCloudModal">
                        <div ><span>FROM</span></div>
                        <div className='mt-2'>click here to select the cloud</div>
                    </div>
                    <div className='middle-box'>
                        <img src={arrowRight} alt="" />
                        <img className={`${syncBtnText === 'two' ? "d-none" : ""}`} src={arrowLeft} alt="" />
                        <button className='switch mt-4' onClick={handleSwitchSync} >Switch to {syncBtnText}-way sync</button>
                    </div>


                    <div className='sync-box' onClick={handleOpen}>
                        <div className='header'><span>TO</span></div>
                        <div className='mt-2'>click here to select the cloud</div>
                    </div>
                </div>

                <div className='mt-5'>
                    <button className='sync-now mx-5'>
                        <ArrowPathIcon className="text-blue-500 mr-3" style={{ width: '16px', height: '16px' }} />
                       {/* <CloudSyncIcon/> */}
                        Sync now
                    </button>
                </div>


            </div>

                <TransitionsModal handleOpen={handleOpen} handleClose={handleClose} open={open} setOpen={setOpen} />

            {/* From cloud modal */}
            <div className="modal fade" id="fromCloudModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Please select</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Added Clouds will be populated here
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Continue</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* To cloud modal */}
            <div className="modal fade" id="toCloudModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Please Select</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Added Clouds will be populated here
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Continue</button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}
