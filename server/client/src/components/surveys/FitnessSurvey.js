import React, { Component } from 'react';
import axios from 'axios';
import Notifications, {notify} from 'react-notify-toast';

class FitnessSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            weight: 0,
            height: 0,
            weeklyExercise: 0,
            eatFastFood: 0,
            bmi: 0,
            diet: false,
            show: true,
            errors: {}

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateField = this.validateField.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        }, () => {this.validateField(name,value)})
    }

    validateField(name, value) {
        let errors = {};

        switch(name) {
            case 'email':
                errors.email = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? '' : ' Email is not invalid';
                break;
            case 'name':
                errors[name] = (value.length > 0) ? '' : 'Fill in the field';
                break;
            default:
                errors[name] = isNaN(value) ? 'Enter a numeric value' : '';
                break;
        }
        this.setState({
            errors
        });
    }

    toggle(event) {
        this.setState({
            [event.target.name]: !!event.target.value
        })
        console.log('after:',this.state.diet)
    }

    handleSubmit(e) {
        e.preventDefault();
        //0.453592 is conversion to kg
        const meters = this.state.height * 0.0254;
        const kg = this.state.weight * 0.453592;
        const bmi = kg / (meters * meters);
        this.setState({
            bmi
        })
        const user = {
            email: this.state.email,
            name: this.state.name,
            weeklyExercise: this.state.weeklyExercise,
            eatFastFood: this.state.eatFastFood,
            bmi
        }

        axios.post('/surveyPost', user)
            .then(res => {
                console.log(res);
                let message, message1;
                if(this.state.bmi < 24)
                    message = `Your bmi is ${this.state.bmi}. This is a healthy bmi.`;
                else if(this.state.bmi < 30 && this.state.bmi > 24)
                    message = `Your bmi is ${this.state.bmi}. Your bmi is slightly higher than the expected range.`;
                else if(this.state.bmi > 30)
                    message = `Your bmi is ${this.state.bmi}. Your bmi is in the danger zone and much higher than it should be.`;
                if(this.state.weeklyExercise >= 2.5)
                    message1 = "This is a great range of weekly exercise to be in. Make sure to keep up the moderate exercise and maybe incorporate vigorous exercise to go above.";
                else
                    message1 = "Try adding some moderate exercise into you week. Maybe start by walking to work. 150 minutes of exercise is average for a healthy lifestyle per week. Meeting with friends can make things easier to tackle."
                notify.show(
                    <div>
                        <h5>BMI</h5>
                        {message}
                        <h5>Weekly exercise</h5>
                        {message1}
                        <br/>
                        <button onClick={notify.hide}>close</button>
                    </div>, "success", -1
                    );
            })
            .catch(err => console.log("error"))

    }

    render() {
        return (
            <div>
                <Notifications />
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" onChange={this.handleChange}/>
                    </label>
                    {this.state.errors.name}
                    <br/>
                    <label>
                        Email:
                        <input type="text" name="email" onChange={this.handleChange} />
                    </label>
                    {this.state.errors.email}
                    <br/>
                    <label>
                        What is your height (inches)?
                        <input type="text" name="height" onChange={this.handleChange} />
                    </label>
                    {this.state.errors.height}
                    <br/>
                    <label>
                        What is your weight (pounds)
                        <input type="text" name="weight" onChange={this.handleChange} />
                    </label>
                    {this.state.errors.weight}
                    <br/>
                    <label>
                        How many hours do you exercise a week?
                        <input type="text" name="weeklyExercise" onChange={this.handleChange} />
                    </label>
                    {this.state.errors.weeklyExercise}
                    <br/>
                    <label>
                        How many times a week do you eat fast food?
                        <input type="text" name="eatFastFood" onChange={this.handleChange} />
                    </label>
                    {this.state.errors.eatFastFood}
                    <br/>
                    <label>
                        <input type="checkbox" name="diet" value={this.state.diet} onChange={this.toggle} />
                        <span>Overall do you have a healthy diet?</span>
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" name="plan" />
                        <span>Do you have an exercise plan?</span>
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" name="cigarettes" />
                        <span>Do you smoke cigarettes?</span>
                    </label>
                    <br/>
                    <label>
                        <input type="checkbox" name="limits" />
                        <span>Do you have any medical limitations preventing you from exercising?</span>
                    </label>
                    <br/>
                    <button 
                        className="purple darken-4 right btn-large white-text" type="submit"
                        onClick={this.handleSubmit}>
                        Submit
                    </button>
                    <br/>
                </form>
                {this.alertShow}
            </div>
        )
    }
}

export default FitnessSurvey;