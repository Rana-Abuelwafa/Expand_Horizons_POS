import React, { Component } from 'react';
import {Form,Button} from "react-bootstrap";
import {connect} from "react-redux";
import { changeClientStatus,changeSPStatus } from "../../../actions/action";
import {translate} from "react-multi-lang";
import "./popup.scss";
 class StatusPoPUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             msg:""
        }
    }

    fillFormData =(e)=>{
        this.setState({msg:e.target.value})
    }
    closePOPUP =(e)=>{
        e.preventDefault();
        const {profileId,statusId,token,type,user} =this.props;

        const Req = {
            "ProfileId": profileId,
            "AccountStatusId": statusId,
            "description": this.state.msg
        }
    
        if(type === "SP"){
            const key=  user.ApplicationUser && user.ApplicationUser.AccountType  ? user.ApplicationUser.AccountType.Key : "";
     
            const url = key === "CO" ? "/api/OrganizationalServiceProvicers/changestatus" : "/api/IndividualServiceProviders/changestatus";
            this.props.changeSPStatus(token, Req,url).then(() => {
 
            })
        }else{
            this.props.changeClientStatus(token, Req).then(() => {

            })
        }
        
        this.props.closePOPUP();
    }
    
    render() {
        return (
            <div  className="popup" onClose={this.closePOPUP}>
                
             <Form>
             <Form.Group className="signFormIn">
                                    <Form.Label>{this.props.t('register.Reason')}</Form.Label>
                                    <Form.Control type="text" required name="msg" onChange={this.fillFormData} />
                                </Form.Group>
             </Form>
         <Button type="submit" className="close" onClick={this.closePOPUP}>Send</Button>
       </div >
     
        )
    }
}

function mapStateToProps(state) {
    return {
        SPStatus: state.SPStatus,
        ClientStatus:state.ClientStatus

    };
}
const mapDispatchToProps = {
    changeClientStatus: changeClientStatus,
    changeSPStatus:changeSPStatus
};
export default translate(
    connect(mapStateToProps, mapDispatchToProps)(StatusPoPUp));

