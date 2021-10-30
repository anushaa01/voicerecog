import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../user-registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  constructor(private service: UserRegistrationService,private route:Router) { }
  count=this.service.score;
  level=this.service.from_api;
  stats:any;
  history:any;
  skill:any;
  
  ngOnInit(): void {
    
      this.calculate_lsrw();
  }
  calculate_lsrw(){
   
    // let resp=this.service.getStats(this.service.user_id.userId)
    // resp.subscribe((data:any) => {
    //   {
    //     this.stats=data;
    //     this.level=this.stats.levelStats;
    //     this.skill=this.stats.skillStats;
    //     // this.service.user_statistics=this.stats;
    //     console.log(this.stats);
    //   }});

  }
  individual_calculation(){
    // this.s=(this.s2/this.s1)*100;
    // this.r=(this.r2/this.r1)*100;
    // this.l=(this.l2/this.l1)*100;
    // this.w=(this.w2/this.w1)*100;
  }
  replay(){
    
    this.route.navigate(['/replay']);
  }


}
