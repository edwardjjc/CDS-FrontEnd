<template>
<v-dialog v-model="visible" max-width="800" persistent scope="pay">
    <v-card>
        <v-card-title class="headline grey lighten-2">
            <h3 class="headline">
                <slot name="title">
                    <v-icon>credit_card</v-icon>&nbsp;Detalles del Pago
                </slot>
            </h3>
        </v-card-title>

        <v-layout xs12 row wrap style="padding:10px;">
            <v-flex xs12 sm6 md6 lg6 wrap>
                <div>
                    <v-card class="mx-auto" dark max-width="400" style="border-radius: 15px;background-color: midnightblue;">
                        <v-card-title>
                            <img src="../../../public/Card-Payments-Logo/chip.png" style="height: 70px;" />
                            <v-spacer></v-spacer>
                            <!-- <v-icon large left>mdi-twitter</v-icon> -->
                            <img v-if="cardType.type === 'visa'" src="../../../public/Card-Payments-Logo/visa.png" style="height: 70px;" />
                            <img v-else-if="cardType.type === 'mastercard'" src="../../../public/Card-Payments-Logo/mastercard.png" style="height: 70px;" />
                            <img v-else-if="cardType.type === 'amex'" src="../../../public/Card-Payments-Logo/amex.png" style="height: 70px;" />
                            <img v-else-if="cardType.type === 'discover'" src="../../../public/Card-Payments-Logo/discover.png" style="height: 70px;" />
                            <img v-else src="../../../public/Card-Payments-Logo/visa.png" style="height: 70px;" />
                        </v-card-title>

                        <v-card-text>
                            <!-- 4025 2542 5256 5254 -->
                            <v-list-tile class="grow">
                                <br />

                                <v-text-field :disabled="totalPagoOnline <= 0" label="Número de Tarjeta" v-model="cardNumber" style="width: 250px;" placeholder="#### #### #### ####" :mask="cardType.mask"></v-text-field>
                            </v-list-tile>
                        </v-card-text>

                        <v-card-actions style="padding-bottom: 15px;">
                            <v-list-tile class="grow">
                                <v-text-field :disabled="totalPagoOnline <= 0" class="centered-input" v-model="cardName" style="width: 150px;" v-uppercase>
                                    <label slot="label" style="font-size:small;">Nombre del Tarjetahabiente</label>
                                </v-text-field>

                                <v-spacer></v-spacer>
                                <v-layout align-center justify-end style="font-size:small;">
                                    <v-text-field :disabled="totalPagoOnline <= 0" class="centered-input" v-model="cardExpiry" style="width: 50px;font-size:small;" hint="MM/YY" placeholder="MM/YY" mask="##/##">
                                        <label slot="label" style="font-size:small;">Mes/Año</label>
                                    </v-text-field>
                                    <v-spacer></v-spacer>
                                    <v-text-field :disabled="totalPagoOnline <= 0" class="centered-input" v-model="cardCvc" style="width: 20px;font-size:small;" :maxlength="cardType.cvvLen" name="cardCvc">
                                        <label slot="label" style="font-size:small;">CVV</label>
                                    </v-text-field>
                                    <span></span>
                                </v-layout>
                            </v-list-tile>
                        </v-card-actions>
                    </v-card>
                </div>
            </v-flex>

            <v-flex xs12 sm6 md6 lg6 wrap>
                <v-card style="margin-left: 20px;" class="white elevation-0">
                    <br />
                    <v-divider></v-divider>
                    <h3 style="font-family: monospace;">Servicios</h3>
                    <v-divider></v-divider>
                    <table style="font-family: monospace;width: 90%" class="font-weight-bold">
                        <tr v-for="item in serviciosPago" :key="item.descripcion">
                            <td>{{ item.descripcion }}</td>
                            <td style="text-align: right">{{ formatPrice(item.monto) }}</td>
                        </tr>
                    </table>
                    <v-divider></v-divider>
                    <h3 v-if="totalCreditos > 0" class="font-weight-bold" style="font-family: monospace;text-align: right;padding-right: 30px;color: #4CAF50;">CRÉDITO {{ monedaCodigo }} {{ formatPrice(totalCreditos) }}</h3>

                    <h3 class="font-weight-bold" style="font-family: monospace;text-align: right;padding-right: 30px;color: midnightblue;">TOTAL A PAGAR {{ monedaCodigo }} {{ formatPrice(totalPagoOnline) }}</h3>
                    <!-- Campo para abonar un pago comentado -->
                    <!-- <v-flex xs12 sm6 md6 style="text-align: right; margin: auto 0 0 auto; padding-right: 5%;" v-if="!pagoCompleto">
                        <v-text-field v-model="pago" label="Pago" outline style="text-align: right;" hint="Digita el monto que deseas pagar" persistent-hint name="Pago" v-validate="'required|decimal:2'" data-vv-scope="pay"></v-text-field>
                        <span class="red--text">{{ errors.first('Pago', 'pay') }}</span>
                    </v-flex> -->
                </v-card>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-card-actions>
            <slot name="actions">
                <v-spacer></v-spacer>
                <v-btn color="error" flat @click.stop="cancel" :disabled="loadingPayment">
                    <v-icon>cancel</v-icon>&nbsp;Cancelar
                </v-btn>
                <slot name="additional-actions"></slot>
                <v-btn color="success" flat @click.stop="confirm" :loading="loadingPayment" :disabled="errors.any('pay')">
                    <v-icon>done</v-icon>&nbsp;Procesar Pago
                </v-btn>
            </slot>
        </v-card-actions>
        <v-snackbar v-model="snackbar.visible" top :multi-line="snackbar.multiLine" :timeout="4000" :color="snackbar.color">
            {{ snackbar.text }}
            <v-btn flat dark @click="snackbar.visible = false">
                <v-icon>cancel</v-icon>&nbsp;Cerrar
            </v-btn>
        </v-snackbar>

        <v-dialog v-model="loadingPayment" max-width="400px" persistent>
            <v-card>
                <v-card-title>
                    <v-progress-circular indeterminate color="green"></v-progress-circular>
                    <v-spacer></v-spacer>
                    <span>
                        <h4 class="font-weight-bold" style="font-family: monospace">Procesando Pago... Por favor espere un momento.</h4>
                    </span>
                </v-card-title>
            </v-card>
        </v-dialog>
    </v-card>
</v-dialog>
</template>

<script>
import { default as cards } from "../../../src/Views/Financieros/Scripts/cards.js";
//import axios from "axios";
import Vue from "vue";
//import { number } from '@amcharts/amcharts4/core';

export default {
    data() {
        return {
            loadingPayment: false,
            responseData: [],
            responseCode: "00",
            approvedCode: "00000000",
            transaccionId: 0,
            msgResponseCode: "",
            cardNumber: "",
            cardExpiry: "",
            cardCvc: "",
            cardName: "",
            cardErrors: {},
            cardBrand: "",
            cardType: {
                type: "",
                cvvLen: 3,
                mask: "#### #### #### ####"
            },
            pago: null,
            snackbar: {
                visible: false,
                text: "",
                multiLine: false,
                color: "info"
            },
            requestAzul: {
                Channel: "EC",
                Store: "39038540035", // Número de Store dado por Azul
                CardNumber: "", // 5426064000424979
                Expiration: "", // 202412
                CVC: "", // 979
                PosInputMode: "E-Commerce",
                TrxType: "Sale",
                Amount: "10000",
                Itbis: "000",
                CurrencyPosCode: "$",
                Payments: "1",
                Plan: "0",
                AcquirerRefData: "1",
                RRN: "",
                CustomerServicePhone: " ",
                OrderNumber: "DN-17-10005",
                ECommerceUrl: "",
                CustomOrderId: " ",
                TarjetaHabiente: "",
                ServiciosPago: [],
                TotalCredito: 0
            },
            response: []
        };
    },
    methods: {
        async cancel() {
            this.cardNumber = "";
            this.cardName = "";
            this.cardExpiry = "";
            this.cardCvc = "";
            this.cardBrand = "";
            this.$emit("cancel");
        },
        async confirm() {
            /* eslint-disable */

            // Valido que tenga monto a pagar con tarjeta
            if (this.totalPagoOnline > 0) {
                // Valido que todos los datos esten llenos
                if (
                    this.cardNumber === "" ||
                    this.cardName === "" ||
                    this.cardExpiry === "" ||
                    this.cardCvc === ""
                ) {
                    this.showNotification(
                        "warning",
                        "Tienes que llenar todos los datos de su tarjeta. Por favor verifica los datos antes de proceder al pago."
                    );
                    return;
                }

                // Valido que el la tarjeta sea valida
                if (this.validateCardNumber(this.cardNumber) == false) {
                    this.showNotification(
                        "warning",
                        "Número de tajeta invalida. Valida que estés poniendo el número de tarjeta correctamente."
                    );
                    return;
                }

                // Valido que la fecha de vencimiento sea valida
                if (
                    this.validateCardExpiry(
                        this.cardExpiry.substring(0, 2),
                        this.cardExpiry.substring(2, 4)
                    ) == false
                ) {
                    this.showNotification(
                        "warning",
                        "Fecha de Expiración invalida. Valida que estés poniendo la fecha de vencimiento correctamente."
                    );
                    return;
                }

                this.loadingPayment = true;

                // AQUI HAGO LA PETICION AL SERVER DE PAGO PARA RECIBIR LA RESPUESTA

                var actualYear = (new Date()).getFullYear().toString().substring(0, 2);
                this.requestAzul.CardNumber = this.cardNumber.split(' ').join('').toString(); //Remove all spaces
                this.requestAzul.Expiration = actualYear + this.cardExpiry.substring(2, 4).toString() + this.cardExpiry.substring(0, 2).toString();
                this.requestAzul.CVC = this.cardCvc;
                this.requestAzul.Amount = this.totalPagoOnline.toFixed(2).replace(",", "").replace(".", "").toString();
                this.requestAzul.TarjetaHabiente = this.cardName;
                this.requestAzul.ServiciosPago = this.serviciosPago;
                this.requestAzul.TotalCredito = this.totalCreditos;
                try {
                    let requestPayment = await Vue.axios({
                        url: `/api/financieros/pagos-online-request/Azul/1`,
                        method: 'POST',
                        data: this.requestAzul 
                    });

                    this.responseCode = requestPayment.data.responseAzul.isoCode;
                    this.approvedCode = requestPayment.data.responseAzul.authorizationCode;
                    this.msgResponseCode = requestPayment.data.responseAzul.responseMessage;
                    this.transaccionId = requestPayment.data.transaccionID;
                } catch (ex) {
                    //let message = (ex.response && ex.response.status) || ex.message;
                    this.showNotification("error", ex.response.data);

                    this.responseCode = "";
                    this.approvedCode = "";
                    this.transaccionId = 0;
                    this.msgResponseCode = ex.response;
                    this.loadingPayment = false;
                    return;
                }
                finally {
                    this.loadingPayment = false;
                }
            } else {
                this.loadingPayment = true;

                this.responseCode = "-1"; // PAGO SOLAMENTE CON CRÉDITO
                this.approvedCode = "-1";
                this.transaccionId = 0;
                this.msgResponseCode = "Pagado con Crédito";
            }

            await this.$emit("confirm", this.responseCode, this.approvedCode, this.msgResponseCode);

        },
        cleanCard() {
            this.cardNumber = "";
            this.cardName = "";
            this.cardExpiry = "";
            this.cardCvc = "";
            this.cardBrand = "";
        },
        showNotification(color, text) {
            //color : success or error
            this.snackbar.visible = true;
            this.snackbar.color = color;
            this.snackbar.text = text;
            this.snackbar.multiLine = true;
        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace(",", ".");
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        cardFromNumber(num) {
            num = (num + "").replace(/\D/g, "");
            for (let i in cards) {
                for (let j in cards[i].patterns) {
                    let p = cards[i].patterns[j] + "";
                    if (num.substr(0, p.length) === p) {
                        return cards[i];
                    }
                }
            }
        },
        luhnCheck(num) {
            let odd = true;
            let sum = 0;

            let digits = (num + "").split("").reverse();

            for (let i in digits) {
                let digit = parseInt(digits[i], 10);
                if ((odd = !odd)) {
                    digit *= 2;
                }
                if (digit > 9) {
                    digit -= 9;
                }
                sum += digit;
            }

            return sum % 10 === 0;
        },
        validateCardNumber(num) {
            num = (num + "").replace(/\s+|-/g, "");
            if (!/^\d+$/.test(num)) {
                return false;
            }

            let card = this.cardFromNumber(num);
            if (!card) {
                return false;
            }

            return (
                Array.from(card.length).includes(num.length) &&
                (card.luhn === false || this.luhnCheck(num))
            );
        },
        validateCardExpiry(month, year) {
            if (!month) {
                return false;
            }

            if (!year) {
                return false;
            }

            // Allow passing an object
            if (typeof month === "object" && "month" in month) {
                ({ month, year } = month);
            }

            if (!month || !year) {
                return false;
            }

            month = month.toString().trim();
            year = year.toString().trim();

            if (!/^\d+$/.test(month)) {
                return false;
            }
            if (!/^\d+$/.test(year)) {
                return false;
            }
            if (!(1 <= month && month <= 12)) {
                return false;
            }

            if (year.length === 2) {
                if (year < 70) {
                    year = `20${year}`;
                } else {
                    year = `19${year}`;
                }
            }

            if (year.length !== 4) {
                return false;
            }

            let expiry = new Date(year, month);
            let currentTime = new Date();

            // Months start from 0 in JavaScript
            expiry.setMonth(expiry.getMonth() - 1);

            // The cc expires at the end of the month,
            // so we need to make the expiry the first day
            // of the month after
            expiry.setMonth(expiry.getMonth() + 1, 1);

            return expiry > currentTime;
        }
    },
    watch: {
        cardNumber: function (val) {
            if (val != "" && val.length > 1) {
                var detailsCardType = this.cardFromNumber(val);
                if (detailsCardType) {
                    this.cardType.type = detailsCardType.type;
                    this.cardType.cvvLen = detailsCardType.cvcLength[0];
                    if (this.cardType.type == "amex") {
                        this.cardType.mask = "#### ###### #####";
                    } else {
                        this.cardType.mask = "#### #### #### ####";
                    }
                }
            } else {
                this.cardType.type = "";
                this.cardType.cvvLen = 3;
                this.cardType.mask = "#### #### #### ####";
            }
        }
    },
    props: {
        maxWidth: {
            type: String,
            default: "800px"
        },
        visible: {
            type: Boolean,
            required: true
        },
        totalPagoOnline: {
            type: Number,
            required: true
        },
        monedaCodigo: {
            type: String,
            required: true
        },
        serviciosPago: { // id, tipo, descripcion, monto
            type: Array,
            required: false
        },
        totalCreditos: {
            type: Number,
            required: true
        },
        pagoCompleto: {
            type: Boolean,
            required: true,
            default: true
        },
        montoMinimoPago: {
            type: Number,
            default: 0
        }
    }
};
</script>
