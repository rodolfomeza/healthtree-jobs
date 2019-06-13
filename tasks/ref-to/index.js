import "react-responsive-tabs/styles.css";
import { getTreatmentData, getTreatmentFavoriteData, getTreatmentLegends, getTreatmentPrefered, resetFavTreatment, resetTreatmentData, resetTreatmentLegends, resetTreatmentListData, toggleFavTreatment } from "../../../actions/treatmentOptionsActions";
import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import { Link } from "react-router";
import Loader from "../../common/loader";
// import SectionHeader from "../../common/sectionHeader";
import TreatmentName from "./treatmentName";

const tabvalue = [{ name: "VIEW OPTIONS", id: 1 }, { name: "VIEW FAVORITES", id: 2 }];

const newLocal = "patient_treatment_options";
class TreatmentOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: null,
      originalData: null,
      renderTable: false,
      showLoader: true,
      legends: null,
      treatment_types: [],
      openFilter: false,
      userId: null,
      items: [],
      openfilter1: false,
      selectedTabKey: 0,
      whichTab: null,
      openSecondPage: false,
      favdata: null,
      legendsval: null,
      fname: null,
      expertpreferred: null,
      finalexpert: null,
      video_detail: null,
      open_video: false,
      latest_diagnosis: null,
    };
    this.optionsLength = 0;
    // functions
    this.renderChart = this.renderChart.bind(this);
    // this.renderLegends = this.renderLegends.bind(this);
    this.renderSubOptions = this.renderSubOptions.bind(this);
    this.props.getTreatmentLegends(this.props.token);
    this.props.getTreatmentPrefered(this.props.token);
    this.open_filter = this.open_filter.bind(this);
    this.setFavourite = this.setFavourite.bind(this);
    this.findWhichTab = this.findWhichTab.bind(this);
    this.props.getUserInfo(props.token);
    this.handleSecondPage = this.handleSecondPage.bind(this);
  }

  componentDidMount() {
    // this.setState({ showLoader: false });
  }

  findWhichTab(tabname) {
    this.setState({
      whichTab: tabname,
    });
  }

  handleSecondPage(bool, val) {
    this.setState({
      openSecondPage: bool,
      value: val,
    });
  }
  componentWillReceiveProps(nextProps, props) {
    let expertpreferred = [];
    if (nextProps !== props) {
      if (nextProps.latest_diagnosis) {
        this.setState({ latest_diagnosis: nextProps.latest_diagnosis });
      }
      if (nextProps.video_detail && nextProps.video_detail.section === "My Treatment Options" && this.props.video_detail !== nextProps.video_detail) {
        this.setState({ video_detail: nextProps.video_detail });
      }
      if (nextProps.prefereddata && this.props.prefereddata !== nextProps.prefereddata) {
        this.setState({ expertpreferred: nextProps.prefereddata ? nextProps.prefereddata.expert_preferred : "" });
      }
      if (nextProps.toggleFav.isSuccess && nextProps.toggleFav.data) {
        this.props.resetFavTreatment();
        let toggleFavData = nextProps.toggleFav.data;
        let hierarchyObj = toggleFavData.hierarchyObj;

      }
      if (nextProps.favdata && this.props.favdata !== nextProps.favdata) {
        this.setState({ favdata: nextProps.favdata });
      }
      if (nextProps.userinfo && this.props.userinfo !== nextProps.userinfo) {
        let userinfo = nextProps.userinfo;
        this.setState({ userId: userinfo.id, fname: userinfo.attributes.first_name });
      }
      // for legends
      if (nextProps.isLegendSuccess || nextProps.isLegendError) {
        //this.setState({ "showLoader": false });
      }
      if (nextProps.legends && nextProps.isLegendSuccess) {
        this.setState({ legends: nextProps.legends }, function () {
          this.props.resetTreatmentLegends(this.props.token);
          this.props.getTreatmentData(this.props.token, null);
          this.props.getTreatmentFavoriteData(this.props.token);
        });


      }
      if (nextProps.legends && nextProps.isLegendSuccess) {
        this.setState({ legends: nextProps.legends });

      }
      // for treatment options
      if (nextProps.isRequesting) {
        this.setState({ "showLoader": true });
      }
      if (nextProps.isSuccess || nextProps.isError) {
        //this.setState({ "showLoader": false });
      }
      if (nextProps.data && nextProps.isSuccess && nextProps.data !== props.data) {
        let data = nextProps.data;
        this.props.resetTreatmentData();
        this.props.resetTreatmentListData();

        let tmpArr = [];
        // let tmp2, tmp3;

        let treatment_types = [];
        let treatment_types_obj = {};
        if (!this.state.legends) {
          return;
        }

        this.state.legends.map((legend, obj) => {
          treatment_types.push(legend.id);
          treatment_types_obj[legend.id] = [];
        });
        this.setState({ treatment_types: treatment_types });
        // this.setState({ "data": data });
        let optionsGroup = [];
        this.optionsLength = data.length;
        for (let key in this.state.expertpreferred) {
          let tempdata = {};

          tempdata["treatment_id"] = key;
          tempdata["expert_prefered"] = this.state.expertpreferred[key];
          _.find(data, { id: key }) ? expertpreferred.push(tempdata) : "";
        }
        this.setState({ finalexpert: expertpreferred });
        data.map(function (obj, key) {
          treatment_types_obj[obj.attributes.treatment_options_group_id].push(obj);
          !optionsGroup.includes(obj.attributes.treatment_options_group_id) ? optionsGroup.push(obj.attributes.treatment_options_group_id) : "";
        });
        let legendsval = [];


        optionsGroup.map((value) => {
          let tmp = {};
          if (value === 14) {
            tmp = {
              name: _.find(this.state.legends, { id: `${value}` }).attributes.name,
              count: expertpreferred.length,
              colorCode: _.find(this.state.legends, { id: `${value}` }).attributes.color_code,
              iconUrl: _.find(this.state.legends, { id: `${value}` }).attributes.icon_url,
            };
          } else {
            tmp = {
              name: _.find(this.state.legends, { id: `${value}` }).attributes.name,
              count: treatment_types_obj[value].length,
              colorCode: _.find(this.state.legends, { id: `${value}` }).attributes.color_code,
              iconUrl: _.find(this.state.legends, { id: `${value}` }).attributes.icon_url,
            };
          }
          legendsval.push(tmp);
        });
        let expertleng = this.state.finalexpert ? this.state.finalexpert.length : "";
        legendsval.push(
          {
            name: "Clinical Trials",
            count: null,
            iconUrl: require("../../../assets/images/clinical.png"),
            btnlabel: "View Trials",
          });

        let favlen = this.state.favdata && this.state.favdata.length;

        let favlegendsval = {
          name: "My Favorites",
          count: favlen,
          iconUrl: require("../../../assets/images/favleaf.png"),
          className: "imglogosize leaf",
          btnlabel: "View Favorites",
        };
        this.state.favdata && this.state.favdata.length > 0 ? legendsval.push(favlegendsval) : "";

        // let newArr = [];
        // this.state.legends.map((value_legends, indexval) => {

        //   if (_.find(legendsval, { name: value_legends.attributes.name })) {
        //     newArr.push(_.find(legendsval, { name: value_legends.attributes.name }));
        //   }
        // });
        setTimeout(() => {
          this.setState({ legendsval: legendsval, showLoader: false });
        }, 1000);
        
        this.setState({ tableData: data, originalData: data });
        if (this.state.openfilter1) {
          this.setState({ openFilter: true });
        }
      }
    }

  }


  actionFromProp(value) {
    if (value === "fav") {
      this.props.resetFavTreatment();
      this.props.getTreatmentData(this.props.token, "fav");
    } else if (value === "filter") {
      this.props.resetFavTreatment();
      this.props.getTreatmentData(this.props.token, "filter");
    } else {
      this.props.resetFavTreatment();
      this.props.getTreatmentData(this.props.token, null);

    }

  }
  setFavourite(obj, index, parentKey, type) {
    let tmpTreatmentOpt = this.state.tableData;
    if (obj.marked_as && obj.marked_as === "Favorite") {
      let fav_id = obj.favourite_id;
      tmpTreatmentOpt[parentKey].children[type][index].marked_as = null;
      tmpTreatmentOpt[parentKey].children[type][index].favourite_id = null;
      this.setState({ tableData: tmpTreatmentOpt });
      // call destroy
      this.props.toggleFavTreatment(this.props.token, null, fav_id);
    } else {
      tmpTreatmentOpt[parentKey].children[type][index].marked_as = "Favorite";
      this.setState({ tableData: tmpTreatmentOpt });
      let postData = {
        "data": {
          "type": "patient_treatment_options",
          "attributes": {
            "marked_as": "Favorite",
            "user_id": this.state.userId,
            "treatment_option_id": obj.id,
          },
        },
      };
      let hierarchyObj = {
        "isFilter": true,
        "parentKey": parentKey,
        "type": type,
        "index": index,
      };

      // create new entry// create new entry
      this.props.toggleFavTreatment(this.props.token, postData, null, hierarchyObj);
    }

  }
  renderSubOptions(childValues, uniqueKey) {
    let typeLength = this.state.treatment_types.length;
    let returnArr = [];
    for (let i = typeLength - 1; i >= 0; i--) {
      let type = this.state.treatment_types[i];
      if (childValues[type]) {
        if (i + 1 === typeLength) {
          // last element
          if (childValues[type].length) {
            returnArr.push(<td className="outer-dv1" key={uniqueKey + "_" + i} >
              <div className="max-widths">
                <span className="inner-nav-span-last"></span>
                <table className="blue-dv1" >
                  <tbody>
                    {childValues[type].map((treatment, key) => {
                      let split_str = treatment.name.split("(");
                      let path = "javascript:void(0)";
                      if (treatment.link) {
                        path = "/treatment-info/" + treatment.id;
                      }
                      if (parseInt(key + 1) === parseInt(childValues[type].length)) {
                        return <tr key={key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav={this.setFavourite} parentKey={uniqueKey} type={type} />
                            <span className="last-span"></span>
                          </td>
                        </tr>;
                      } else {
                        return <tr key={key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav={this.setFavourite} parentKey={uniqueKey} type={type} />
                          </td>
                        </tr>;
                      }

                    })}

                  </tbody>
                </table>
              </div>
            </td>);
          } else {
            returnArr.push(<td className="outer-dv-no-data" key={uniqueKey + "_" + i} ></td>);
          }

        } else {
          let show_blue_line = false;
          for (let j = i + 1; j < typeLength; j++) {
            let prevElem = this.state.treatment_types[j];
            if (childValues[prevElem].length) {
              show_blue_line = true;
            }
          }
          if (show_blue_line) {
            returnArr.push(<td className="outer-dv1" key={uniqueKey + "_" + i}>
              <div className="max-widths">
                <table className="blue-dv1">
                  <tbody>
                    {childValues[type].map((treatment, key) => {
                      let split_str = treatment.name.split("(");
                      let path = "javascript:void(0)";
                      if (treatment.link) {
                        path = "/treatment-info/" + treatment.id;
                      }
                      if (parseInt(key + 1) === parseInt(childValues[type].length)) {
                        return <tr key={key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav={this.setFavourite} parentKey={uniqueKey} type={type} />
                            <span className="last-span"></span>
                          </td>
                        </tr>;
                      } else {
                        return <tr key={key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav={this.setFavourite} parentKey={uniqueKey} type={type} />
                          </td>
                        </tr>;
                      }

                    })}

                  </tbody>
                </table>
              </div>
            </td>);
          } else {
            returnArr.push(<td className="outer-dv1" key={uniqueKey + "_" + i}>
              <div className="max-widths">
                <span className="inner-nav-span-last"></span>
                <table className="blue-dv1" >
                  <tbody>
                    {childValues[type].map((treatment, key) => {
                      let split_str = treatment.name.split("(");
                      let path = "javascript:void(0)";
                      if (treatment.link) {
                        path = "/treatment-info/" + treatment.id;
                      }
                      if (parseInt(key + 1) === parseInt(childValues[type].length)) {
                        return <tr key={key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav={this.setFavourite} parentKey={uniqueKey} type={type} />
                            <span className="last-span"></span>
                          </td>
                        </tr>;
                      } else {
                        return <tr key={key}>
                          <td className="outer-bluedv">
                            <TreatmentName treatment={treatment} indx={key} path={path} set_fav={this.setFavourite} parentKey={uniqueKey} type={type} />
                          </td>

                        </tr>;
                      }

                    })}
                  </tbody>
                </table>
              </div>
            </td>);
          }
        }
      }

    }
    returnArr = returnArr.reverse();
    return returnArr;
  }

  renderChart(tbldata, key) {
    let uniqueKey = key;
    return <tr className="child-tr" key={key}>
      <td>
        <span className="inner-nav-span"></span>
        <div className="blue-dv">{tbldata.name}</div>
      </td>
      {/* <td></td> */}

      {this.renderSubOptions(tbldata.children, uniqueKey)}
    </tr>;
  }

  open_filter() {
    this.props.getTreatmentData(this.props.token);
    this.setState({
      openfilter1: !this.state.openfilter1,
      openFilter: false,
    });
  }


  tabChanged(e, key, tabObj) {
    e.preventDefault();
    this.setState({ selectedTabKey: key });
    let value;
    if (tabObj.name === "VIEW FAVORITES") {
      value = "fav";
    } else if (tabObj.name === "VIEW OPTIONS") {
      value = null;
    }
    this.props.getTreatmentData(this.props.token, value);

  }


  render() {
    const { selectedTabKey } = this.state;
    let str;
    //console.log("this.state.legendsval", this.state.legendsval);
    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}
        {/* <SectionHeader title = "My Myeloma Treatment Options" video_detail = {this.state.video_detail}/> */}

        {!this.state.openSecondPage &&
          <div>

            {(this.state.latest_diagnosis === "Smoldering myeloma" || this.state.latest_diagnosis === "Monoclonal Gammopathy of Undetermined Significance (MGUS)") ?
              <div className="myeloma_content"><label>
                There are no treatment options for your diagnosis at this time.  There could be some clinical trails so make sure to click the View Trials button to see if there are any trials that might be right for you.
               </label></div> : <div>
                <div className="myeloma_content"><label> Hello {this.state.fname}. Welcome to your treatment options page. The list of treatment options below is personalized for you based on the questions you have already taken the time to answer. Over time as you update your diagnosis, health and treatment information we will continue to customize the list below and provide you with the options that are just right for you. </label></div>
                <div className="myeloma_content"><label> Remember these treatment options are not replacements for medical opinions by a licensed oncologists, hematologists or myeloma specialists. HealthTree provides general guidance that should be taken to a medical professional who can review the specifics of your case.</label></div>
              </div>}
            <div className="treatmenthr">
              {this.state.legendsval && this.state.legendsval.map((value, index) => {
                str = (value.name).replace(/\s+/g, "-").toLowerCase();
                return (
                  <div className="subtreatmenthr custom1-subtreatmenthr treatmentclshome" key={index} >
                    <span className="treatment-outer1">
                      <span className="treatement-images"><img src={value.iconUrl} className={value.className ? value.className : "imglogosize"} /> </span> <span className="treatmentoptionhomecount"> {value.count} </span> <span className="treatmentoptionhomename"> {value.name} </span>
                    </span>
                    <Link to={`/treatment-option/treatments/${str}`} className="treatment-outer-btn"><button className="btn-rt btn blue_btn text-center hvr-bounce-to-top treatmentcls" > {value.btnlabel ? value.btnlabel : "View Treatments"} </button> </Link>
                  </div>
                );
              })}
            </div>
          </div>}
      </div>

    );
  }
}


function mapStateToProps(state) {
  return {
    patientInfo: state.patient.patientinfo,
    data: state.treatmentOptions.data,
    favdata: state.treatmentOptionsFav.data,
    isRequesting: state.treatmentOptions.isRequesting,
    isError: state.treatmentOptions.isError,
    isSuccess: state.treatmentOptions.isSuccess,
    legends: state.treatmentOptions.legends,
    userinfo: state.user.userinfo,
    toggleFav: state.favorite,
    isLegendRequesting: state.treatmentOptions.isLegendRequesting,
    isLegendSuccess: state.treatmentOptions.isLegendSuccess,
    isLegendError: state.treatmentOptions.isLegendError,
    prefereddata: state.treatmentOptions.prefereddata,
    video_detail: state.metaData ? state.metaData.video_detail : "",
    latest_diagnosis: state.metaData.diagnosis_data,

  };
}
export default connect(mapStateToProps, { getTreatmentData, getTreatmentPrefered, getTreatmentFavoriteData, getTreatmentLegends, resetTreatmentLegends, toggleFavTreatment, getUserInfo, resetFavTreatment, resetTreatmentData, resetTreatmentListData })(TreatmentOptions);
