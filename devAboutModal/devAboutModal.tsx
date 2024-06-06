import { Button, Modal } from "antd"
import React from "react"

type DevAboutModalProps = {
    isOpen: boolean;
    onCancel: Function;
    devFIO: string;
    version: string;
    email: string;
    phone?: string;
}

export const DevAboutModal = (props: DevAboutModalProps) => {
    return <>
        <Modal
            title='О разработчике'
            centered
            open={props.isOpen}
            onCancel={() => props.onCancel()}
            footer={[

            ]}
        >
            <div className='d-flex flex-column'>
                <hr className="m-1" />
                <div className='d-flex justify-content-evenly'>
                    <div>
                        {props.version}
                    </div>
                    <a href={`mailto:${props.email}`} target="_blank">
                        {props.email}
                    </a>
                </div>
                <div className='align-self-center'>
                    {props.devFIO}
                </div>
                {
                    props.phone && <div className='align-self-center'>
                        {props.phone}
                    </div>
                }
            </div>
        </Modal >
    </>

}  