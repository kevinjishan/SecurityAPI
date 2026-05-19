import assert from "node:assert/strict";

import {
  AccountService,
  KiwoomClient,
  LsClient,
  MarketContextService,
  MarketFlowService,
  MarketDataService,
  OrderService,
  OverseasStockRealtimeService,
  QuoteService,
  RealtimeService,
  ScannerService,
  SignalInputService,
} from "security-api-reference";

class MockRealtimeClient {
  constructor(broker) {
    this.broker = broker;
    this.handlers = new Map();
    this.subscriptions = [];
  }

  on(event, handler) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => handlers.delete(handler);
  }

  async subscribe(id, key, options = {}) {
    const subscription = { id, key, options };
    this.subscriptions.push(subscription);
    return {
      ...subscription,
      action: "subscribe",
    };
  }

  async unsubscribe(id, key, options = {}) {
    return {
      id,
      key,
      options,
      action: "unsubscribe",
    };
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }
}

const kiwoomCalls = [];
const kiwoom = new KiwoomClient({
  appKey: "mock-kiwoom-app-key",
  secretKey: "mock-kiwoom-secret-key",
  env: "mock",
  fetch: async (url, init) => {
    kiwoomCalls.push(readCall(url, init));

    if (url.endsWith("/oauth2/token")) {
      return jsonResponse({
        token: "mock-kiwoom-token",
        token_type: "Bearer",
        expires_dt: "20991231235959",
      });
    }

    if (init.headers["api-id"] === "ka10004") {
      return jsonResponse({
        bid_req_base_tm: "093000",
        sel_fpr_bid: "70100",
        sel_fpr_req: "10",
        buy_fpr_bid: "70000",
        buy_fpr_req: "15",
        tot_sel_req: "100",
        tot_buy_req: "200",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10095") {
      return jsonResponse({
        atn_stk_infr: [
          { stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "70000" },
          { stk_cd: "000660", stk_nm: "SK하이닉스", cur_prc: "120000" },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10081") {
      return jsonResponse({
        stk_cd: "005930",
        stk_dt_pole_chart_qry: [
          {
            dt: "20260519",
            open_pric: "69800",
            high_pric: "70500",
            low_pric: "69600",
            cur_prc: "70100",
            trde_qty: "9263135",
            trde_prica: "648525",
            pred_pre: "+600",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10080") {
      return jsonResponse({
        stk_cd: "005930",
        stk_min_pole_chart_qry: [
          {
            cntr_tm: "20260519093000",
            open_pric: "69900",
            high_pric: "70100",
            low_pric: "69800",
            cur_prc: "70000",
            trde_qty: "100",
            trde_prica: "7000000",
          },
          {
            cntr_tm: "20260519093500",
            open_pric: "70000",
            high_pric: "70200",
            low_pric: "69900",
            cur_prc: "70100",
            trde_qty: "300",
            trde_prica: "21030000",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10030") {
      return jsonResponse({
        tdy_trde_qty_upper: [
          {
            stk_cd: "005930",
            stk_nm: "삼성전자",
            cur_prc: "-152000",
            pred_pre: "-100",
            flu_rt: "-0.07",
            trde_qty: "34954641",
            trde_amt: "5308092",
            trde_tern_rt: "+48.21",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10032") {
      return jsonResponse({
        trde_prica_upper: [
          {
            rank: "2",
            stk_cd: "005930",
            stk_nm: "삼성전자",
            cur_prc: "-152000",
            pred_pre: "-100",
            flu_rt: "-0.07",
            trde_qty: "34954641",
            trde_prica: "5308092",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10027") {
      return jsonResponse({
        pred_pre_flu_rt_upper: [
          {
            rank: "3",
            stk_cd: "005930",
            stk_nm: "삼성전자",
            cur_prc: "-152000",
            pred_pre: "-100",
            flu_rt: "-0.07",
            now_trde_qty: "34954641",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10171") {
      return jsonResponse({
        trnm: "CNSRLST",
        return_code: 0,
        return_msg: "",
        data: [
          ["4", "거래량 급증"],
          ["5", "기관외국인상위100"],
        ],
      });
    }

    if (init.headers["api-id"] === "ka10172") {
      return jsonResponse({
        trnm: "CNSRREQ",
        seq: "4",
        cont_yn: "N",
        next_key: "",
        return_code: 0,
        return_msg: "",
        data: [
          {
            9001: "A005930",
            302: "삼성전자",
            10: "000070000",
            25: "2",
            11: "000000400",
            12: "000000056",
            13: "001000000",
            16: "000069900",
            17: "000070100",
            18: "000069500",
          },
        ],
      });
    }

    if (init.headers["api-id"] === "ka10173") {
      return jsonResponse({
        trnm: "CNSRREQ",
        seq: "4",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
        data: [],
      });
    }

    if (init.headers["api-id"] === "ka10174") {
      return jsonResponse({
        trnm: "CNSRCLR",
        seq: "4",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka20001") {
      return jsonResponse({
        cur_prc: "2725.12",
        pred_pre_sig: "2",
        pred_pre: "+15.50",
        flu_rt: "+0.57",
        trde_qty: "500000",
        trde_prica: "12000000",
        trde_frmatn_stk_num: "900",
        trde_frmatn_rt: "93.75",
        open_pric: "2710.00",
        high_pric: "2730.00",
        low_pric: "2700.00",
        upl: "2",
        rising: "520",
        stdns: "80",
        fall: "360",
        lst: "1",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka20006") {
      return jsonResponse({
        inds_cd: "001",
        inds_dt_pole_qry: [
          {
            dt: "20260519",
            open_pric: "271000",
            high_pric: "273000",
            low_pric: "270000",
            cur_prc: "272512",
            trde_qty: "500000",
            trde_prica: "12000000",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10051") {
      return jsonResponse({
        inds_netprps: [
          {
            inds_cd: "001_AL",
            inds_nm: "종합(KOSPI)",
            cur_prc: "+272512",
            pre_smbol: "2",
            pred_pre: "+1550",
            flu_rt: "57",
            trde_qty: "500000",
            sc_netprps: "+255",
            insrnc_netprps: "+0",
            invtrt_netprps: "+0",
            bank_netprps: "+0",
            jnsinkm_netprps: "+0",
            endw_netprps: "+0",
            etc_corp_netprps: "+0",
            ind_netprps: "-16",
            frgnr_netprps: "-622",
            native_trmt_frgnr_netprps: "+4",
            natn_netprps: "+0",
            samo_fund_netprps: "+1",
            orgn_netprps: "+601",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka90005") {
      return jsonResponse({
        prm_trde_trnsn: [
          {
            cntr_tm: "170500",
            dfrt_trde_sel: "0",
            dfrt_trde_buy: "0",
            dfrt_trde_netprps: "0",
            ndiffpro_trde_sel: "1",
            ndiffpro_trde_buy: "17",
            ndiffpro_trde_netprps: "+17",
            dfrt_trde_sell_qty: "0",
            dfrt_trde_buy_qty: "0",
            dfrt_trde_netprps_qty: "0",
            ndiffpro_trde_sell_qty: "0",
            ndiffpro_trde_buy_qty: "0",
            ndiffpro_trde_netprps_qty: "+0",
            all_sel: "1",
            all_buy: "17",
            all_netprps: "+17",
            kospi200: "+47839",
            basis: "-146.59",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "kt00001") {
      return jsonResponse({
        entr: "1000000",
        pymn_alow_amt: "800000",
        ord_alow_amt: "750000",
        d1_entra: "900000",
        d2_entra: "850000",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "kt00018") {
      return jsonResponse({
        tot_pur_amt: "1000000",
        tot_evlt_amt: "1200000",
        tot_evlt_pl: "200000",
        tot_prft_rt: "20.00",
        prsm_dpst_aset_amt: "1300000",
        acnt_evlt_remn_indv_tot: [
          {
            stk_cd: "A005930",
            stk_nm: "삼성전자",
            rmnd_qty: "10",
            trde_able_qty: "8",
            pur_pric: "60000",
            cur_prc: "70000",
            pur_amt: "600000",
            evlt_amt: "700000",
            evltv_prft: "100000",
            prft_rt: "16.67",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "kt00007") {
      return jsonResponse({
        acnt_ord_cntr_prps_dtl: [
          {
            ord_no: "0000050",
            stk_cd: "A005930",
            trde_tp: "시장가",
            ord_qty: "0000000010",
            ord_uv: "0000070000",
            cnfm_qty: "0000000008",
            acpt_tp: "접수",
            ord_tm: "13:05:43",
            ori_ord: "0000000",
            stk_nm: "삼성전자",
            io_tp_nm: "현금매수",
            cntr_qty: "0000000008",
            cntr_uv: "0000069900",
            ord_remnq: "0000000002",
            comm_ord_tp: "영웅문4",
            cnfm_tm: "13:05:44",
            dmst_stex_tp: "KRX",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    return jsonResponse({
      stk_cd: "005930",
      stk_nm: "삼성전자",
      cur_prc: "70000",
      return_code: 0,
      return_msg: "정상적으로 처리되었습니다",
    }, {
      headers: {
        "cont-yn": "N",
      },
    });
  },
});

const kiwoomResult = await kiwoom.request("ka10001", {
  stk_cd: "005930",
});

assert.equal(kiwoomResult.ok, true);
assert.equal(kiwoomResult.data.stk_cd, "005930");
assert.equal(kiwoomCalls.length, 2);
assert.equal(kiwoomCalls[1].headers["api-id"], "ka10001");
assert.equal(kiwoomCalls[1].headers.authorization, "Bearer mock-kiwoom-token");

const lsCalls = [];
const ls = new LsClient({
  appKey: "mock-ls-app-key",
  appSecretKey: "mock-ls-secret-key",
  macAddress: "AABBCCDDEEFF",
  env: "prod",
  fetch: async (url, init) => {
    lsCalls.push(readCall(url, init));

    if (url.endsWith("/oauth2/token")) {
      return jsonResponse({
        access_token: "mock-ls-token",
        token_type: "Bearer",
        expires_in: 86400,
      });
    }

    if (init.headers.tr_cd === "t8407") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t8407OutBlock1: [
          { shcode: "005930", hname: "삼성전자", price: 70000 },
          { shcode: "000660", hname: "SK하이닉스", price: 120000 },
        ],
      });
    }

    if (init.headers.tr_cd === "t1102") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1102OutBlock: {
          shcode: "005930",
          hname: "삼성전자",
          price: 70000,
          recprice: 69000,
          open: 69900,
          high: 71000,
          low: 69500,
          volume: 1000000,
          total: 417000000,
          listing: 5969783,
        },
      });
    }

    if (init.headers.tr_cd === "t8412") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t8412OutBlock: {
          shcode: "005930",
          jiclose: 69000,
          highend: 89700,
          lowend: 48300,
          rec_count: 1,
        },
        t8412OutBlock1: [
          {
            date: "20260519",
            time: "093000",
            open: 69900,
            high: 70100,
            low: 69800,
            close: 70000,
            jdiff_vol: 100,
            value: 7000000,
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1463") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1463OutBlock: { idx: 20 },
        t1463OutBlock1: [
          {
            shcode: "005930",
            hname: "삼성전자",
            price: 71800,
            change: 400,
            diff: "0.56",
            volume: 4817961,
            value: 874631,
            jnilvolume: 12161798,
            jnilvalue: 874631,
            total: 417000000,
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1866") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "조회성공",
        t1866OutBlock: {
          result_count: 1,
          cont: "",
          cont_key: "",
        },
        t1866OutBlock1: [
          {
            query_index: "testID0000",
            group_name: "나의전략",
            query_name: "거래량 급증",
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1859") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "",
        t1859OutBlock: {
          result_count: 1,
          result_time: "171729",
          text: "",
        },
        t1859OutBlock1: [
          {
            shcode: "000250",
            hname: "삼천당제약",
            price: 68300,
            sign: "2",
            change: 1200,
            diff: "1.79",
            volume: 241418,
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1860") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "조회 완료",
        t1860OutBlock: {
          sSysUserFlag: "U",
          sFlag: "E",
          sResultFlag: "S",
          sTime: "172249",
          sAlertNum: "1722490200A",
          Msg: "정상처리 되었습니다.",
        },
      });
    }

    if (init.headers.tr_cd === "t1511") {
      const body = JSON.parse(init.body);
      const isKosdaq = body.t1511InBlock.upcode === "301";

      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1511OutBlock: {
          upcode: isKosdaq ? "301" : "001",
          hname: isKosdaq ? "코스닥" : "종합",
          pricejisu: isKosdaq ? "850.12" : "2725.12",
          jniljisu: isKosdaq ? "848.00" : "2709.62",
          sign: "2",
          change: isKosdaq ? "2.12" : "15.50",
          diffjisu: isKosdaq ? "0.25" : "0.57",
          volume: isKosdaq ? 300000 : 500000,
          value: isKosdaq ? 6000000 : 12000000,
          openjisu: isKosdaq ? "849.00" : "2710.00",
          highjisu: isKosdaq ? "852.00" : "2730.00",
          lowjisu: isKosdaq ? "846.00" : "2700.00",
          highjo: isKosdaq ? 420 : 520,
          unchgjo: isKosdaq ? 50 : 80,
          lowjo: isKosdaq ? 310 : 360,
          upjo: isKosdaq ? 1 : 2,
          downjo: isKosdaq ? 0 : 1,
        },
      });
    }

    if (init.headers.tr_cd === "t1514") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1514OutBlock: {
          cts_date: "20260518",
        },
        t1514OutBlock1: [
          {
            date: "20260519",
            upcode: "001",
            jisu: "2725.12",
            sign: "2",
            change: "15.50",
            diff: "0.57",
            volume: 500000,
            diff_vol: "12.50",
            value2: 12000000,
            high: 520,
            unchg: 80,
            low: 360,
            uprate: "54.17",
            frgsvolume: 200,
            orgsvolume: -120,
            openjisu: "2710.00",
            highjisu: "2730.00",
            lowjisu: "2700.00",
            up: 2,
            down: 1,
            totjo: 960,
            rate: "1.20",
            divrate: "0.80",
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1485") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "조회완료",
        t1485OutBlock: {
          pricejisu: "2610.62",
          sign: "2",
          change: "9.26",
          volume: 263165,
          yhighjo: 5,
          yupjo: 0,
          yunchgjo: 944,
          ylowjo: 1,
          ydownjo: 0,
          ytrajo: 7,
        },
        t1485OutBlock1: [
          {
            chetime: "084000",
            jisu: "2601.36",
            sign: "3",
            change: "0.00",
            volume: 488,
            volcha: 0,
            diff: "0.00",
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1602") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1602OutBlock: {
          cts_time: "10263000",
          ex_upcode: "001",
          ms_08: 205539,
          md_08: 213937,
          svolume_08: -8398,
          rate_08: 0,
          ms_17: 12000,
          md_17: 8750,
          svolume_17: 3250,
          rate_17: 0,
          ms_18: 12247,
          md_18: 7099,
          svolume_18: 5148,
          rate_18: 0,
        },
        t1602OutBlock1: [
          {
            time: "10263000",
            sv_08: -200,
            sv_17: 80,
            sv_18: 120,
          },
        ],
      });
    }

    if (init.headers.tr_cd === "t1632") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1632OutBlock: {
          date: "20230602",
          time: "175811",
          idx: 19,
        },
        t1632OutBlock1: [
          {
            time: "180518",
            k200jisu: "342.67",
            sign: "2",
            change: "004.59",
            k200basis: "000.28",
            tot1: 102,
            tot2: 3,
            tot3: 99,
            cha1: 20,
            cha2: 8,
            cha3: 12,
            bcha1: 82,
            bcha2: -5,
            bcha3: 87,
          },
        ],
      });
    }

    if (init.headers.tr_cd === "CSPAQ12200") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        CSPAQ12200OutBlock2: {
          Dps: 1000000,
          MnyoutAbleAmt: 800000,
          MnyOrdAbleAmt: 750000,
          BalEvalAmt: 1200000,
          DpsastTotamt: 1300000,
          D1Dps: 900000,
          D2Dps: 850000,
        },
      });
    }

    if (init.headers.tr_cd === "t0424") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t0424OutBlock: {
          sunamt: 1300000,
          mamt: 1000000,
          tappamt: 1200000,
          tdtsunik: 200000,
          cts_expcode: "",
        },
        t0424OutBlock1: [
          {
            expcode: "005930",
            hname: "삼성전자",
            janqty: 10,
            mdposqt: 8,
            pamt: 60000,
            price: 70000,
            mamt: 600000,
            appamt: 700000,
            dtsunik: 100000,
            sunikrt: "16.67",
          },
        ],
      });
    }

    if (init.headers.tr_cd === "CSPAQ13700") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        CSPAQ13700OutBlock2: {
          RecCnt: 1,
          SellOrdQty: 0,
          BuyOrdQty: 10,
          BuyExecQty: 8,
          SellExecQty: 0,
          BuyExecAmt: 559200,
          SellExecAmt: 0,
        },
        CSPAQ13700OutBlock3: [
          {
            OrdNo: "50",
            OrgOrdNo: "0",
            ExecNo: "1",
            IsuNo: "A005930",
            IsuNm: "삼성전자",
            BnsTpCode: "2",
            BnsTpNm: "매수",
            OrdPtnNm: "현금매수",
            ExecYn: "1",
            OrdQty: 10,
            OrdPrc: 70000,
            ExecQty: 8,
            ExecPrc: 69900,
            MrcAbleQty: 2,
            OrdDt: "20260518",
            OrdTime: "130543",
            ExecTrxTime: "130544",
            CommdaNm: "API",
          },
        ],
      });
    }

    return jsonResponse({
      rsp_cd: "00000",
      rsp_msg: "정상적으로 조회가 완료되었습니다.",
      t1101OutBlock: {
        shcode: "005930",
        hname: "삼성전자",
        price: 70000,
        offerho1: 70100,
        offerrem1: 10,
        bidho1: 70000,
        bidrem1: 15,
      },
    }, {
      headers: {
        tr_cont: "N",
      },
    });
  },
});

const lsResult = await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" },
});

assert.equal(lsResult.ok, true);
assert.equal(lsResult.data.t1101OutBlock.shcode, "005930");
assert.equal(lsCalls.length, 2);
assert.equal(lsCalls[1].headers.tr_cd, "t1101");
assert.equal(lsCalls[1].headers.authorization, "Bearer mock-ls-token");
assert.equal(lsCalls[1].headers.mac_address, "AABBCCDDEEFF");

const quote = new QuoteService({ kiwoom, ls });
const kiwoomQuote = await quote.getDomesticStockCurrentPrice("kiwoom", "005930");
const lsQuote = await quote.getDomesticStockCurrentPrice("ls", "005930");
const kiwoomOrderBook = await quote.getDomesticStockOrderBook("kiwoom", "005930");
const lsOrderBook = await quote.getDomesticStockOrderBook("ls", "005930");
const kiwoomMultiQuote = await quote.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"]);
const lsMultiQuote = await quote.getDomesticStockMultiCurrentPrice("ls", ["005930", "000660"]);
const marketData = new MarketDataService({ kiwoom, ls });
const kiwoomDailyCandles = await marketData.getDomesticStockDailyCandles("kiwoom", "005930", {
  baseDate: "20260519",
});
const lsMinuteCandles = await marketData.getDomesticStockMinuteCandles("ls", "005930", {
  intervalMinutes: 5,
  count: 1,
  endDate: "20260519",
});
const lsBasicInfo = await marketData.getDomesticStockBasicInfo("ls", "005930");
const scanner = new ScannerService({ kiwoom, ls });
const kiwoomVolumeRankings = await scanner.getDomesticStockVolumeRankings("kiwoom", {
  market: "kospi",
});
const lsValueRankings = await scanner.getDomesticStockValueRankings("ls", {
  market: "kospi",
});
const kiwoomConditionList = await scanner.listConditionSearches("kiwoom");
const kiwoomConditionSearch = await scanner.searchCondition("kiwoom", { seq: "4", name: "거래량 급증" });
const lsConditionList = await scanner.listConditionSearches("ls", {
  userId: "testID",
});
const lsConditionSearch = await scanner.searchCondition("ls", {
  queryIndex: "testID0000",
  name: "거래량 급증",
});
const marketContext = new MarketContextService({ kiwoom, ls });
const kiwoomMarketSnapshot = await marketContext.getDomesticMarketSnapshot("kiwoom", {
  indexes: ["kospi", "kosdaq"],
});
const lsMarketSnapshot = await marketContext.getDomesticMarketSnapshot("ls", {
  indexes: ["kospi", "kosdaq"],
});
const kiwoomIndexDailyCandles = await marketContext.getDomesticIndexDailyCandles("kiwoom", "kospi", {
  baseDate: "20260519",
});
const lsIndexDailyCandles = await marketContext.getDomesticIndexDailyCandles("ls", "kospi", {
  count: 1,
});
const lsExpectedIndex = await marketContext.getDomesticExpectedIndex("ls", "kospi", {
  session: "preopen",
});
const marketFlow = new MarketFlowService({ kiwoom, ls });
const kiwoomInvestorFlow = await marketFlow.getDomesticInvestorFlow("kiwoom", "kospi", {
  baseDate: "20260519",
});
const lsInvestorFlow = await marketFlow.getDomesticInvestorFlow("ls", "kospi", {
  unit: "quantity",
  count: 1,
});
const kiwoomProgramTrading = await marketFlow.getProgramTradingTrend("kiwoom", "kospi", {
  date: "20260519",
});
const lsProgramTrading = await marketFlow.getProgramTradingTrend("ls", "kospi", {
  unit: "quantity",
  date: "20260519",
});
const signalInputs = await new SignalInputService({ kiwoom, ls }).getDomesticStockSignalInputs("kiwoom", "005930", {
  includeRankings: true,
  includeConditionSearch: true,
  includeMarketContext: true,
  includeMarketIndexCandles: true,
  includeMarketFlow: true,
  conditionSearches: [{ seq: "4", name: "거래량 급증" }],
  intervalMinutes: 5,
  minuteCount: 2,
  market: "kospi",
  baseDate: "20260519",
});
const account = new AccountService({ kiwoom, ls });
const kiwoomCash = await account.getDomesticStockCash("kiwoom");
const lsCash = await account.getDomesticStockCash("ls");
const kiwoomBalance = await account.getDomesticStockBalance("kiwoom");
const lsBalance = await account.getDomesticStockBalance("ls");
const kiwoomOrderHistory = await account.getDomesticStockOrderHistory("kiwoom", {
  orderDate: "20260518",
  symbol: "005930",
});
const lsOrderHistory = await account.getDomesticStockOrderHistory("ls", {
  orderDate: "20260518",
  symbol: "005930",
});
const order = new OrderService({ kiwoom, ls });
const kiwoomBuyDryRun = await order.buyDomesticStock("kiwoom", {
  symbol: "005930",
  quantity: 1,
  estimatedPrice: 70000,
}, {
  maxOrderAmount: 100000,
  allowedSymbols: ["005930"],
});
const lsSellDryRun = await order.sellDomesticStock("ls", {
  symbol: "005930",
  quantity: 1,
  price: 70000,
  orderType: "limit",
}, {
  maxOrderAmount: 100000,
  blockedSymbols: ["000660"],
});
const kiwoomRealtime = new MockRealtimeClient("kiwoom");
const realtime = new RealtimeService({ kiwoom: kiwoomRealtime });
const realtimeSignalUpdates = [];
const realtimeSignalSubscription = await new SignalInputService({
  quote: {},
  marketData: {},
  scanner: new ScannerService({ kiwoom, kiwoomRealtime }),
  realtime,
}).subscribeDomesticStockSignalInputs("kiwoom", "005930", {
  onUpdate: (data) => realtimeSignalUpdates.push(data),
}, {
  initialInputs: signalInputs.data,
  intervalMinutes: 5,
  tradeDate: "20260519",
  includeMarketStatus: true,
  includeRealtimeConditionSearch: true,
  conditionSearches: [{ seq: "4", name: "거래량 급증" }],
});
const realtimeMessages = [];
const realtimeSubscription = await realtime.subscribeDomesticStockTrades("kiwoom", "005930", {
  onMessage: (message) => realtimeMessages.push(message),
});
const marketStatusMessages = [];
const marketStatusSubscription = await realtime.subscribeMarketStatus("kiwoom", {
  onMessage: (message) => marketStatusMessages.push(message),
});
const lsRealtime = new MockRealtimeClient("ls");
const overseasRealtime = new OverseasStockRealtimeService({ ls: lsRealtime });
const overseasRealtimeMessages = [];
const overseasTradeSubscription = await overseasRealtime.subscribeOverseasStockTrades("ls", {
  symbol: "TSLA",
  exchangeCode: "82",
}, {
  onMessage: (message) => overseasRealtimeMessages.push(message),
});
const overseasOrderEventSubscription = await overseasRealtime.subscribeOverseasStockOrderEvents("ls", {
  onMessage: (message) => overseasRealtimeMessages.push(message),
}, {
  trCode: "AS1",
});

kiwoomRealtime.emit("realtime", {
  data: {
    trnm: "REAL",
    data: [
      {
        type: "0B",
        name: "주식체결",
        item: "005930",
        values: {
          10: "70150",
          13: "1000050",
          15: "+50",
          16: "69900",
          17: "70200",
          18: "69800",
          20: "093501",
        },
      },
    ],
  },
});
kiwoomRealtime.emit("realtime", {
  data: {
    trnm: "REAL",
    data: [
      {
        type: "0D",
        name: "주식호가잔량",
        item: "005930",
        values: {
          21: "093502",
          41: "70200",
          51: "70100",
          61: "100",
          71: "300",
          121: "100",
          125: "300",
        },
      },
    ],
  },
});
lsRealtime.emit("realtime", {
  data: {
    header: { tr_cd: "GSC", tr_key: "82TSLA".padEnd(18, " ") },
    body: {
      symbol: "TSLA",
      trdtm: "093001",
      kortm: "223001",
      price: "283.820000",
      diff: "1.130000",
      rate: "0.40",
      trdq: "15",
      totq: "1000",
      cgubun: "+",
    },
  },
});
lsRealtime.emit("realtime", {
  data: {
    header: { tr_cd: "AS1", tr_key: "" },
    body: {
      sAcntNo: "12345678901",
      sOrdNo: "77",
      sExecNO: "1",
      sShtnIsuNo: "TSLA",
      sBnsTp: "2",
      sOrdQty: "10",
      sExecQty: "8",
      sExecPrc: "279.900000",
      sUnercQty: "2",
    },
  },
});
kiwoomRealtime.emit("realtime", {
  data: {
    trnm: "REAL",
    data: [
      {
        type: "0s",
        name: "장시작시간",
        item: "",
        values: {
          215: "3",
          20: "090000",
          214: "000000",
        },
      },
    ],
  },
});
kiwoomRealtime.emit("realtime", {
  data: {
    trnm: "REAL",
    data: [
      {
        type: "02",
        name: "조건검색",
        item: "005930",
        values: {
          841: "4",
          9001: "A005930",
          843: "I",
          20: "093503",
          907: "2",
        },
      },
    ],
  },
});

assert.equal(kiwoomQuote.ok, true);
assert.equal(kiwoomQuote.data.price, 70000);
assert.equal(lsQuote.ok, true);
assert.equal(lsQuote.data.price, 70000);
assert.equal(kiwoomOrderBook.ok, true);
assert.equal(kiwoomOrderBook.data.asks[0].price, 70100);
assert.equal(lsOrderBook.ok, true);
assert.equal(lsOrderBook.data.asks[0].price, 70100);
assert.equal(kiwoomMultiQuote.ok, true);
assert.equal(kiwoomMultiQuote.data.length, 2);
assert.equal(lsMultiQuote.ok, true);
assert.equal(lsMultiQuote.data.length, 2);
assert.equal(kiwoomDailyCandles.ok, true);
assert.equal(kiwoomDailyCandles.data.candles[0].close, 70100);
assert.equal(lsMinuteCandles.ok, true);
assert.equal(lsMinuteCandles.data.candles[0].timestamp, "20260519093000");
assert.equal(lsBasicInfo.ok, true);
assert.equal(lsBasicInfo.data.listedShares, 5969783);
assert.equal(kiwoomVolumeRankings.ok, true);
assert.equal(kiwoomVolumeRankings.data.items[0].volume, 34954641);
assert.equal(lsValueRankings.ok, true);
assert.equal(lsValueRankings.data.items[0].value, 874631);
assert.equal(kiwoomConditionList.ok, true);
assert.equal(kiwoomConditionList.data.conditions[0].seq, "4");
assert.equal(kiwoomConditionSearch.ok, true);
assert.equal(kiwoomConditionSearch.data.items[0].symbol, "005930");
assert.equal(lsConditionList.ok, true);
assert.equal(lsConditionList.data.conditions[0].queryIndex, "testID0000");
assert.equal(lsConditionSearch.ok, true);
assert.equal(lsConditionSearch.data.items[0].symbol, "000250");
assert.equal(kiwoomMarketSnapshot.ok, true);
assert.equal(kiwoomMarketSnapshot.data.indexes[0].price, 2725.12);
assert.equal(lsMarketSnapshot.ok, true);
assert.equal(lsMarketSnapshot.data.breadth.rising, 940);
assert.equal(kiwoomIndexDailyCandles.ok, true);
assert.equal(kiwoomIndexDailyCandles.data.candles[0].close, 2725.12);
assert.equal(lsIndexDailyCandles.ok, true);
assert.equal(lsIndexDailyCandles.data.candles[0].breadth.risingRate, 54.17);
assert.equal(lsExpectedIndex.ok, true);
assert.equal(lsExpectedIndex.data.summary.latestExpectedIndex, 2601.36);
assert.equal(kiwoomInvestorFlow.ok, true);
assert.equal(kiwoomInvestorFlow.data.summary.foreignInstitutionalNetBuy, -21);
assert.equal(lsInvestorFlow.ok, true);
assert.equal(lsInvestorFlow.data.summary.foreignInstitutionalNetBuy, 8398);
assert.equal(kiwoomProgramTrading.ok, true);
assert.equal(kiwoomProgramTrading.data.summary.totalNetBuy, 17);
assert.equal(lsProgramTrading.ok, true);
assert.equal(lsProgramTrading.data.summary.totalNetBuy, 99);
assert.equal(signalInputs.ok, true);
assert.equal(signalInputs.data.metrics.price.current, 70000);
assert.equal(signalInputs.data.metrics.orderBook.bestAskPrice, 70100);
assert.equal(signalInputs.data.market.targetMarket, "kospi");
assert.equal(signalInputs.data.metrics.market.flow.programTotalNetBuy, 17);
assert.equal(signalInputs.data.rankings.volume.rank, 1);
assert.equal(signalInputs.data.conditions.metrics.matchedCount, 1);
assert.equal(signalInputs.data.signals.conditions.anyMatch, true);
assert.equal(realtimeSignalSubscription.ok, true);
assert.equal(realtimeSignalUpdates.length, 4);
assert.equal(realtimeSignalUpdates[0].quote.price, 70150);
assert.equal(realtimeSignalUpdates[0].realtime.tradeCount, 1);
assert.equal(realtimeSignalUpdates[1].metrics.orderBook.bestBidPrice, 70100);
assert.equal(realtimeSignalUpdates[1].realtime.orderBookUpdateCount, 1);
assert.equal(realtimeSignalUpdates[2].market.status.phase, "open");
assert.equal(realtimeSignalUpdates[2].realtime.marketStatusUpdateCount, 1);
assert.equal(realtimeSignalUpdates[3].conditions.metrics.matchedCount, 1);
assert.equal(realtimeSignalUpdates[3].realtime.conditionSearchEventCount, 1);
assert.equal(kiwoomCash.ok, true);
assert.equal(kiwoomCash.data.summary.orderableAmount, 750000);
assert.equal(lsCash.ok, true);
assert.equal(lsCash.data.summary.orderableAmount, 750000);
assert.equal(kiwoomBalance.ok, true);
assert.equal(kiwoomBalance.data.positions[0].symbol, "005930");
assert.equal(lsBalance.ok, true);
assert.equal(lsBalance.data.positions[0].symbol, "005930");
assert.equal(kiwoomOrderHistory.ok, true);
assert.equal(kiwoomOrderHistory.data.orders[0].symbol, "005930");
assert.equal(lsOrderHistory.ok, true);
assert.equal(lsOrderHistory.data.orders[0].symbol, "005930");
assert.equal(kiwoomBuyDryRun.ok, true);
assert.equal(kiwoomBuyDryRun.dryRun, true);
assert.equal(kiwoomBuyDryRun.data.request.trde_tp, "3");
assert.equal(kiwoomBuyDryRun.data.safety.orderValue, 70000);
assert.equal(lsSellDryRun.ok, true);
assert.equal(lsSellDryRun.dryRun, true);
assert.equal(lsSellDryRun.data.request.CSPAT00601InBlock1.BnsTpCode, "1");
assert.equal(lsSellDryRun.data.safety.allowed, true);
assert.equal(realtimeSubscription.ok, true);
assert.equal(realtimeSubscription.id, "0B");
assert.equal(marketStatusSubscription.ok, true);
assert.equal(marketStatusSubscription.id, "0s");
assert.equal(kiwoomRealtime.subscriptions.some((subscription) => subscription.id === "0B" && subscription.key === "005930"), true);
assert.equal(kiwoomRealtime.subscriptions.some((subscription) => subscription.id === "0D" && subscription.key === "005930"), true);
assert.equal(kiwoomRealtime.subscriptions.some((subscription) => subscription.id === "0s" && subscription.key === ""), true);
assert.equal(realtimeMessages[0].kind, "trade");
assert.equal(realtimeMessages[0].symbol, "005930");
assert.equal(realtimeMessages[0].price, 70150);
assert.equal(realtimeMessages[0].body["10"], "70150");
assert.equal(marketStatusMessages[0].kind, "marketStatus");
assert.equal(marketStatusMessages[0].eventName, "장시작");
assert.equal(overseasTradeSubscription.ok, true);
assert.equal(overseasTradeSubscription.id, "GSC");
assert.equal(overseasOrderEventSubscription.ok, true);
assert.equal(overseasOrderEventSubscription.id, "AS1");
assert.equal(lsRealtime.subscriptions.some((subscription) => subscription.id === "GSC" && subscription.key === "82TSLA".padEnd(18, " ")), true);
assert.equal(lsRealtime.subscriptions.some((subscription) => subscription.id === "AS1" && subscription.key === ""), true);
assert.equal(overseasRealtimeMessages[0].kind, "trade");
assert.equal(overseasRealtimeMessages[0].market, "overseas");
assert.equal(overseasRealtimeMessages[0].price, 283.82);
assert.equal(overseasRealtimeMessages[1].kind, "orderEvent");
assert.equal(overseasRealtimeMessages[1].eventType, "executed");
assert.equal(overseasRealtimeMessages[1].executedQuantity, 8);

console.log("Mock Kiwoom result:", kiwoomResult.data);
console.log("Mock LS result:", lsResult.data);
console.log("Mock QuoteService results:", {
  kiwoom: kiwoomQuote.data,
  ls: lsQuote.data,
  kiwoomOrderBook: kiwoomOrderBook.data,
  lsOrderBook: lsOrderBook.data,
  kiwoomMultiQuote: kiwoomMultiQuote.data,
  lsMultiQuote: lsMultiQuote.data,
  kiwoomDailyCandles: kiwoomDailyCandles.data,
  lsMinuteCandles: lsMinuteCandles.data,
  lsBasicInfo: lsBasicInfo.data,
  kiwoomVolumeRankings: kiwoomVolumeRankings.data,
  lsValueRankings: lsValueRankings.data,
  kiwoomConditionList: kiwoomConditionList.data,
  kiwoomConditionSearch: kiwoomConditionSearch.data,
  lsConditionList: lsConditionList.data,
  lsConditionSearch: lsConditionSearch.data,
  kiwoomMarketSnapshot: kiwoomMarketSnapshot.data,
  lsMarketSnapshot: lsMarketSnapshot.data,
  kiwoomIndexDailyCandles: kiwoomIndexDailyCandles.data,
  lsIndexDailyCandles: lsIndexDailyCandles.data,
  lsExpectedIndex: lsExpectedIndex.data,
  kiwoomInvestorFlow: kiwoomInvestorFlow.data,
  lsInvestorFlow: lsInvestorFlow.data,
  kiwoomProgramTrading: kiwoomProgramTrading.data,
  lsProgramTrading: lsProgramTrading.data,
  signalInputs: signalInputs.data,
  realtimeSignalInputs: realtimeSignalUpdates.at(-1),
  kiwoomCash: kiwoomCash.data,
  lsCash: lsCash.data,
  kiwoomBalance: kiwoomBalance.data,
  lsBalance: lsBalance.data,
  kiwoomOrderHistory: kiwoomOrderHistory.data,
  lsOrderHistory: lsOrderHistory.data,
  kiwoomBuyDryRun: kiwoomBuyDryRun.data,
  lsSellDryRun: lsSellDryRun.data,
  realtimeSubscription,
  marketStatusSubscription,
  overseasTradeSubscription,
  overseasOrderEventSubscription,
  realtimeMessage: realtimeMessages[0],
  marketStatusMessage: marketStatusMessages[0],
  overseasRealtimeMessages,
});
console.log("Mock broker client examples passed.");

function readCall(url, init) {
  return {
    url,
    method: init.method,
    headers: init.headers,
    body: init.body,
  };
}

function jsonResponse(body, options = {}) {
  return new Response(JSON.stringify(body), {
    status: options.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}
