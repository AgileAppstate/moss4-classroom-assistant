import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import lifecycle from "react-pure-lifecycle"

import AssignmentPanel from "../shared/containers/AssignmentPanel"
import SubmissionArchivePanelList from "./containers/SubmissionArchivePanelList"
import NavFooter from "../shared/components/NavFooter"
import ArchiveProgressPanel from "./containers/ArchiveProgressPanel"

import { settingsResetState } from "../../modules/settings/actions/settings-reset-state"
import { progress } from "../../modules/submissions/selectors"

import { cloneDestination } from "../../modules/settings/selectors"
import { getAssignmentFolder } from "../../lib/pathutils"
import { name } from "../../modules/assignment/selectors"
import { dir } from "../../modules/assignment/selectors"

const methods = {
  componentDidMount (_props) {
  }
}

const forwardButton = (progress, quitApp) => {
  if (progress < 0 || progress === 100) {
    return (
      {
        label: "Download Another Assignment",
        route: "/populate",
        onClick: quitApp
      }
    )
  }
}

const mossButton = (progress, destination, assignment) => {
  if (progress < 0 || progress === 100) {
    return (
      {
        label: "Run MOSS on files",
        route: "/archive",
        onClick: async function (state) {
          const util = require("util")
          const exec = util.promisify(require("child_process").exec)
          window.alert(assignment)
          const child = await exec(`./app/routes/archive/moss -l java ${assignment}/*/*.java ${assignment}/*/*.java >> ./app/routes/archive/output.moss`,
            function (error, stdout, stderr) {
              window.alert(stdout)
              // console.log("stdout: " + stdout);
              // console.log("stderr: " + stderr);
              if (error !== null) {
                window.alert("exec error: " + error)
              }
            })
          child()
        }
      }
    )
  }
}

const ArchivePage = ({
  quitApp,
  progress,
  cloneDestination,
  assignment
}) => (
  <div>
    <AssignmentPanel/>
    <ArchiveProgressPanel progress={progress} cloneDestination={cloneDestination} assignment={assignment}/>
    <SubmissionArchivePanelList />
    <NavFooter
      left={{
        label: "Cancel",
        route: "/populate",
        onClick: quitApp,
        disabled: progress < 0 || progress === 100
      }}
      right= {forwardButton(progress, quitApp)}
      center= {mossButton(progress, cloneDestination, assignment)}
    />
  </div>
)

const mapStateToProps = (state) => ({
  progress: progress(state),
  cloneDestination: cloneDestination(state),
  assignment: state.assignment.dir
})

const mapDispatchToProps = (dispatch) => ({
  quitApp: () => {
    dispatch(settingsResetState())
  }
})

ArchivePage.propTypes = {
  quitApp: PropTypes.func.isRequired,
  progress: PropTypes.number,
  cloneDestination: PropTypes.string,
  assignment: PropTypes.string
}

export default lifecycle(methods)(connect(mapStateToProps, mapDispatchToProps)(ArchivePage))
