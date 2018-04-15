drawPasBranchingModel()

function drawPasBranchingModel() {
    let myTemplate = template();

    let gitGraph = new GitGraph({
        template: myTemplate, // "blackarrow" or "metro"
        reverseArrow: false,
        orientation: "vertical",
        mode: "extended" //"compact"
    });
    let defaultBranch = gitGraph.branch("default");
    defaultBranch.commit({
        detailId: "default-branch",
        message: "some commit"
    });
    let release10 = defaultBranch.branch("release_10");
    release10.commit({
        message: "create a major release branch",
        detailId: "major-release"
    });

    let api2TeamBranch = release10.branch("api2_10-0");
    api2TeamBranch.commit("create a branch for another command");

    let api2FeatureBranch = api2TeamBranch.branch("PLA-00002-feature-branch");
    api2FeatureBranch.commit("PLA-00002 feature branch");
    api2FeatureBranch.merge(api2TeamBranch);
    let api2Stabilization = api2TeamBranch.branch("api2-10-0-stabilization");
    api2Stabilization.commit({
        message: "PLA-00003 fix some issues",
        detailId: "stabilization-branch"
    });
    api2Stabilization.merge(api2TeamBranch);

    let api1Team1Branch = release10.branch("api1_10-0");
    api1Team1Branch.commit("create a command branch");

    let api1featureBranch = api1Team1Branch.branch("PLA-00001-branch");
    api1featureBranch.commit("PLA-00001 make some changes");
    api1featureBranch.commit("PLA-00001 make more changes");
    api1featureBranch.merge(api1Team1Branch);

    let api1Stabilization = api1Team1Branch.branch("api1_10-0_stabilization");
    api1Stabilization.commit("fix something");

    api1Stabilization.merge(api1Team1Branch);


    let release10_0 = api1Stabilization.branch("release_10-0");
    release10_0.commit({
        message: "Create branch for building a first RPM package of the release",
        detailId: "minor-release"
    });
    api2Stabilization.merge(release10_0);

    release10_0.commit("commits for build - pom.xml version changes");
    release10_0.merge(release10);


    release10.merge(defaultBranch);
    return gitGraph;
}

function template() {
    let myTemplateConfig = {
        branch: {
            showLabel: true,
            color: "#000000",
            mergeStyle: "straight",
            labelRotation: 0,
            lineWidth: 4,
            spacingX: 50
        },
        commit: {
            spacingY: -60,
            dot: {
                size: 12,
                strokeColor: "#000000",
                strokeWidth: 7
            },
            message: {
                color: "black",
                displayAuthor: false,
                displayBranch: true,
                displayHash: false,
                font: "normal 12pt Arial"
            },
            shouldDisplayTooltipsInCompactMode: false, // default = true
            tooltipHTMLFormatter: function (commit) {
                return "<b>" + commit.sha1 + "</b>" + ": " + commit.message;
            }
        },
        arrow: {
            size: 16,
            offset: 2.5
        }
    };
    return new GitGraph.Template(myTemplateConfig);
}
