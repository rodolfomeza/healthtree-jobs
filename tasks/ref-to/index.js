import "react-responsive-tabs/styles.css";
import {
  getTreatmentData,
  getTreatmentFavoriteData,
  getTreatmentLegends,
  getTreatmentPrefered,
  toggleFavTreatment
} from "../../../actions/treatmentOptionsActions";
import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { getUserInfo } from "../../../actions/UserActions";
import Loader from "../../common/Loader";
import ThingsToConsider from "./ThingsToConsider";
import LatestDiagnosis from "./latest-diagnosis";
import TreatmentList from "./treatment-list";

class TreatmentOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: null,
      showLoader: true,
      treatmentOptionsGroups: [],
      preferredLength: null
    };
  }

  componentDidMount() {
    this.props.getUserInfo(this.props.token);
    this.props.getTreatmentFavoriteData(this.props.token);
    Promise.resolve(this.props.getTreatmentData(this.props.token))
      .then(() => this.props.getTreatmentPrefered(this.props.token))
      .then(() => this.props.getTreatmentLegends(this.props.token));
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps !== props) {
      if (nextProps.isRequesting) {
        this.setState({ showLoader: true });
      }

      if (nextProps.legends && nextProps.isLegendSuccess) {
        if (
          nextProps.data &&
          nextProps.data !== props.data &&
          nextProps.isSuccess &&
          nextProps.data.length > 0
        ) {
          const treatmentOptionsGroups = nextProps.legends
            .map(({ id, attributes: { name, icon_url, color_code } }) => {
              const groupTreatments = nextProps.data.filter(
                ({ attributes: { treatment_options_group_id } }) =>
                  `${treatment_options_group_id}` === id
              );
              return {
                name,
                count: groupTreatments.length,
                iconUrl: icon_url,
                colorCode: color_code
              };
            })
            .filter(
              ({ name }) =>
                !["Clinical Trials", "Expert Preferred Treatments"].includes(
                  name
                )
            );

          this.setState({
            treatmentOptionsGroups,
            showLoader: false,
            tableData: nextProps.data
          });
        }

        if (nextProps.prefereddata && nextProps.prefereddata.expert_preferred) {
          const preferredLength = _.reduce(
            nextProps.prefereddata.expert_preferred,
            (result, _value, key) => {
              return result + (_.find(nextProps.data, { id: key }) ? 1 : 0);
            },
            0
          );

          this.setState({ preferredLength });
        }
      }
    }
  }

  render() {
    const { favdata } = this.props;
    const clinicalTrials = {
      name: "Clinical Trials",
      count: null,
      iconUrl: require("../../../assets/images/clinical.png"),
      btnlabel: "View Trials"
    };
    const favorites = {
      name: "My Favorites",
      count: (favdata && favdata.length) || null,
      iconUrl: require("../../../assets/images/favleaf.png"),
      className: "imglogosize leaf",
      btnlabel: "View Favorites"
    };
    const preferred = {
      name: "Expert Preferred Treatments",
      count: this.state.preferredLength,
      iconUrl: require("../../../assets/images/expertrecommendation.png"),
      colorCode: "#0e7b3c"
    };

    return (
      <div id="page-content-wrapper">
        {this.state.showLoader && <Loader />}

        <div>
          <LatestDiagnosis
            userinfo={this.props.userinfo}
            latest_diagnosis={this.props.latest_diagnosis}
          />

          <TreatmentList
            treatments={this.state.treatmentOptionsGroups}
            extra={[preferred, clinicalTrials, favorites]}
          />

          <ThingsToConsider />
        </div>
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
    latest_diagnosis: state.metaData.diagnosis_data
  };
}

export default connect(
  mapStateToProps,
  {
    getTreatmentData,
    getTreatmentPrefered,
    getTreatmentFavoriteData,
    getTreatmentLegends,
    toggleFavTreatment,
    getUserInfo
  }
)(TreatmentOptions);
