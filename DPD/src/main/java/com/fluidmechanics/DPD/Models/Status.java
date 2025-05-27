package com.fluidmechanics.DPD.Models;

public enum Status {
    CREATED,
    SENT_BACK,
    UNDER_SCRUTINY,
    APPROVED,
}

// no need to overcomplicate things
// once it's pushed to QA, it will bounce between SENT_BACK, UNDER_SCRUNITY and APPROVED