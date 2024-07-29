import { Component ,OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators,AbstractControl, FormArray } from '@angular/forms';
import { PhoneFormatPipe } from './phone-number.pipe'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  form: FormGroup;
  phoneFormatPipe = new PhoneFormatPipe();

  constructor(private fb:FormBuilder ){
  this.form = this.fb.group({
    first_Name : ['',[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],
    Last_Name : ['',[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],
    Email : ['',[Validators.required,Validators.email]],
    gender: ['', Validators.required],
    // phoneNumber: ['', Validators.required],
    password:['',Validators.required],
    confirm_password:['',Validators.required],
    address: new FormArray([]),
    city:['',[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],
    state:['',Validators.required],
    zip:['',Validators.required],
  },{ validators: this.passwordMatchValidator })
  ; 
}

get address():FormArray{
  return this.form.get('address') as FormArray;
}
addAddress(){
  const addressField = this.fb.group({
    mainAddress:['',[Validators.required,Validators.minLength(5),Validators.maxLength(15)]],
    personalDetail: new FormArray([])
  });
  this.address.push(addressField);
}
removeAddress(mainAddressIndex:number){
  this.address.removeAt(mainAddressIndex)
}
getPersonalDetails(mainAddressIndex:number){
  return this.address.at(mainAddressIndex).get('personalDetail') as  FormArray;
}
addPersonalDetails(mainAddressIndex:number){
    const personalDetailFormGroup = this.fb.group({
      phoneNumber: ['', Validators.required],
      bloodGroup : ['', Validators.required],
    });
    this.getPersonalDetails(mainAddressIndex).push(personalDetailFormGroup);

    personalDetailFormGroup.get('phoneNumber')?.valueChanges.subscribe(value => {
      const formattedValue = this.phoneFormatPipe.transform(value);
      personalDetailFormGroup.get('phoneNumber')?.setValue(formattedValue, { emitEvent: false });
    });
}
removePersonalDetails(mainAddressIndex:number, personalDetailIndex:number){
  this.getPersonalDetails(mainAddressIndex).removeAt(personalDetailIndex)
}


ngOnInit() {
  this.addAddress();
  this.restrictToAlphabets('first_Name');
  this.restrictToAlphabets('Last_Name');
  this.restrictToAlphabets('city');
  this.restrictToNumbers('zip');

}

//It will restrict to enter numbers and special character
// You can only enter alphabets
restrictToAlphabets(controlName: string) {
  const control = this.form.get(controlName);
  if (control) {
    control.valueChanges.subscribe(value => {
      const filteredValue = value.replace(/[^a-zA-Z]/g, '');
      control.setValue(filteredValue, { emitEvent: false });
    });
  }
}
restrictToNumbers(controlName: string) {
  const control = this.form.get(controlName);
  if (control) {
    control.valueChanges.subscribe(value => {
      const filteredValue = value.replace(/[^0-9]/g, '');
      control.setValue(filteredValue, { emitEvent: false });
    });
  }
}

//Custom Validator - Password Matching
passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirm_password')?.value;
  if (password !== confirmPassword) {
    return { mismatch: true };
  }
  return null;
}

//custom validator - Checking Email ,  Either you have to enter gmail/yahoo
isGmailOrYahooEmail(control: AbstractControl): { [key: string]: boolean } | null {
  const email = control.value;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const yahooRegex = /^[a-zA-Z0-9._%+-]+@yahoo\.com$/;
  if (gmailRegex.test(email) || yahooRegex.test(email)) {
    return null;
  }
  return { isGmailOrYahooEmail: true };
}


saveToLocalStorage(data: any) {
  localStorage.setItem('formData', JSON.stringify(data));
}

  submit(){
      
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    console.log("Form Group" , this.form , "Form Values" , this.form.value);
    console.log(this.form.get('phoneNumber')?.value)
  
    this.saveToLocalStorage(this.form.value);
  }
}











    // // Log each form control validity state
    // console.log("Form Validity: ", this.form.valid);
    // Object.keys(this.form.controls).forEach(key => {
    //   const controlErrors = this.form.get(key)?.errors;
    //   if (controlErrors != null) {
    //     console.log('Key control: ' + key + ', errors: ', controlErrors);
    //   }
    // });