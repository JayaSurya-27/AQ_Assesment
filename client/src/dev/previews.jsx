import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Login from "../components/login";
import {CandidateProfile} from "../components/candidateProfile";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Login">
                <Login/>
            </ComponentPreview>
            <ComponentPreview path="/CandidateProfile">
                <CandidateProfile/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews