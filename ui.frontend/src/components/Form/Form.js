import React, { Component } from 'react';
import { MapTo } from '@adobe/cq-react-editable-components';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
var qs = require('qs');
var dataLogin = qs.stringify({
 'username': 'test@testAEM.com',
'password': 'Fleetcor123!6BYJcyNRVtI4SaZcGD6hoIZXa',
'grant_type': 'password',
'client_id': '3MVG9Kip4IKAZQEXl.CBYyWAJ.hGnR5vp.T1JjD18UPAri6iZTlZxFqPfR5bJ2WEpSRsZxOsrIx.s4MZLi_Pg',
'client_secret': '2DDB1F12C6D4D7731267712AE0EB4B38CE948350EDD82AF240F3CDEB7771589A' 
});

const FormEditConfig = {
    emptyLabel: 'Form',
    isEmpty: function (props) {
        return !props;
    },
};

function submitResult(formcontent, auth){
	
	console.log(auth);
var data = JSON.stringify({"lastname":formcontent.lname,
							"firstname":formcontent.fname,
							"email":formcontent.email,
							"Phone":formcontent.phone,
							"ProductInterest__c":formcontent.dropdownVal,
							"Company":"sample"});
var config = {
  method: 'post',
  url: auth.data.instance_url+'/services/data/v48.0/sobjects/Lead',
  headers: { 
    'Authorization': auth.data.token_type+" "+auth.data.access_token, 
    'Content-Type': 'application/json',
  },
  data : data
};

console.log(config);
axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
}

function submitData(formcontent){
var config = {
  method: 'post',
  url: 'https://login.salesforce.com/services/oauth2/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
  },
  data : dataLogin
};

axios(config)
.then(function (response) {
  submitResult(formcontent, response);
})
.catch(function (error) {
  console.log(error);
});
}

function MyVerticallyCenteredModal(props) {
    console.log(props);
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thanks for Submitting !!
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                FirstName : {props.formdata.fname} <br />
                LastName : {props.formdata.lname} <br />
                Email : {props.formdata.email} <br />
                Phone : {props.formdata.phone} <br />
                How did you hear about us? : {props.formdata.dropdownVal}
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

class FormComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            formdata: { fname: "", lname: "", email: "", phone: "", dropdownVal: "" }
        };
    }


    render() {
        const { heading, subHeading } = this.props;

        const handleSubmit = event => {
            event.preventDefault();

            const formData = {};
            formData.fname = document.getElementById("formBasicfName").value;
            formData.lname = document.getElementById("formBasiclName").value;
            formData.email = document.getElementById("formBasicEmail").value;
            formData.phone = document.getElementById("formBasicPhone").value;
            formData.dropdownVal = document.getElementById("selector").value;
            submitData(formData);
            this.setState({ show: true });
            this.setState({ formdata: formData });
            document.getElementById("impForm").reset();
            setTimeout(() => {
                this.setState({ show: false });
            }, 10000);
        };

        return (
            <div>
                <h1>{heading}</h1>
                <br />
                <h3>{subHeading}</h3>
                <br />
                <br />
                <Form id="impForm" onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicfName" >
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter FirstName" required/>
                    </Form.Group>
                    <Form.Group controlId="formBasiclName" required>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter LastName" required/>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail" required>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone" required>
                        <Form.Label>Phone Number ( US phone format )</Form.Label>
                        <Form.Control type="Number" placeholder="Enter number" required/>
                    </Form.Group>
                    <Form.Group controlId="selector">
                        <Form.Label>How did you hear about us?</Form.Label>
                        <Form.Control as="select" custom required>
                            <option value="google">Google</option>
                            <option value="Fleetcor">Fleetcor</option>
                            <option value="Friend">Friend</option>
                        </Form.Control >
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit" onClick={this.getFormData}>
                        Submit
                </Button>
                </Form>
                <MyVerticallyCenteredModal formdata={this.state.formdata} show={this.state.show} />
            </div>
        )
    }
}

export default MapTo('wknd-spa-react/components/Form')(
    FormComp,
    FormEditConfig
);